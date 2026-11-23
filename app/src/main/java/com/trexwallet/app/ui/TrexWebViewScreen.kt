package com.trexwallet.app.ui

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.graphics.Color as AndroidColor
import android.net.Uri
import android.os.Message
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.trexwallet.app.R
import com.trexwallet.app.web.AssetContentHandler

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun TrexWebViewScreen() {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val assetHandler = remember(context) { AssetContentHandler(context.applicationContext) }

    var webViewRef by remember { mutableStateOf<WebView?>(null) }
    var canGoBack by remember { mutableStateOf(false) }
    var hasLoadError by remember { mutableStateOf(false) }
    var customFullscreenView by remember { mutableStateOf<View?>(null) }
    var customViewCallback by remember { mutableStateOf<WebChromeClient.CustomViewCallback?>(null) }
    var filePathCallback by remember { mutableStateOf<ValueCallback<Array<Uri>>?>(null) }

    val filePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        val callback = filePathCallback
        filePathCallback = null
        if (uri != null) {
            callback?.onReceiveValue(arrayOf(uri))
        } else {
            callback?.onReceiveValue(null)
        }
    }

    BackHandler(enabled = customFullscreenView != null || canGoBack) {
        if (customFullscreenView != null) {
            customViewCallback?.onCustomViewHidden()
            customFullscreenView = null
            customViewCallback = null
        } else {
            webViewRef?.goBack()
        }
    }

    DisposableEffect(lifecycleOwner, webViewRef) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> webViewRef?.onResume()
                Lifecycle.Event.ON_PAUSE -> webViewRef?.onPause()
                else -> Unit
            }
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .windowInsetsPadding(WindowInsets.safeDrawing)
    ) {
        AndroidView(
            modifier = Modifier
                .fillMaxSize()
                .testTag("trex_webview"),
            factory = { ctx ->
                WebView(ctx).apply {
                    layoutParams = ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    )
                    setBackgroundColor(AndroidColor.BLACK)
                    overScrollMode = View.OVER_SCROLL_NEVER
                    isVerticalScrollBarEnabled = false
                    isHorizontalScrollBarEnabled = false

                    settings.apply {
                        javaScriptEnabled = true
                        domStorageEnabled = true
                        databaseEnabled = true
                        mediaPlaybackRequiresUserGesture = false
                        allowFileAccess = false
                        allowContentAccess = true
                        javaScriptCanOpenWindowsAutomatically = true
                        setSupportMultipleWindows(true)
                        loadWithOverviewMode = true
                        useWideViewPort = true
                        mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
                        cacheMode = WebSettings.LOAD_DEFAULT
                    }

                    val webViewInstance = this
                    CookieManager.getInstance().apply {
                        setAcceptCookie(true)
                        setAcceptThirdPartyCookies(webViewInstance, true)
                    }

                    webViewClient = object : WebViewClient() {
                        override fun shouldInterceptRequest(
                            view: WebView?,
                            request: WebResourceRequest?
                        ) = request?.let { assetHandler.handleRequest(it) }

                        override fun shouldOverrideUrlLoading(
                            view: WebView?,
                            request: WebResourceRequest?
                        ): Boolean {
                            val req = request ?: return false
                            val uri = req.url ?: return false
                            if (!req.isForMainFrame) return false

                            if (assetHandler.shouldIntercept(uri)) {
                                return false
                            }

                            openExternalUri(ctx, uri)
                            return true
                        }

                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            canGoBack = view?.canGoBack() == true
                        }

                        override fun doUpdateVisitedHistory(
                            view: WebView?,
                            url: String?,
                            isReload: Boolean
                        ) {
                            super.doUpdateVisitedHistory(view, url, isReload)
                            canGoBack = view?.canGoBack() == true
                        }

                        override fun onReceivedError(
                            view: WebView?,
                            request: WebResourceRequest?,
                            error: WebResourceError?
                        ) {
                            super.onReceivedError(view, request, error)
                            if (request?.isForMainFrame == true) {
                                hasLoadError = true
                            }
                        }
                    }

                    webChromeClient = object : WebChromeClient() {
                        override fun onShowFileChooser(
                            webView: WebView?,
                            callback: ValueCallback<Array<Uri>>?,
                            fileChooserParams: FileChooserParams?
                        ): Boolean {
                            filePathCallback?.onReceiveValue(null)
                            filePathCallback = callback

                            val acceptType = fileChooserParams?.acceptTypes
                                ?.firstOrNull { it.isNotBlank() }
                                ?: "*/*"
                            return try {
                                filePickerLauncher.launch(acceptType)
                                true
                            } catch (_: Exception) {
                                filePathCallback?.onReceiveValue(null)
                                filePathCallback = null
                                false
                            }
                        }

                        override fun onCreateWindow(
                            view: WebView?,
                            isDialog: Boolean,
                            isUserGesture: Boolean,
                            resultMsg: Message?
                        ): Boolean {
                            val transport = resultMsg?.obj as? WebView.WebViewTransport ?: return false
                            val tempWebView = WebView(ctx).apply {
                                webViewClient = object : WebViewClient() {
                                    override fun shouldOverrideUrlLoading(
                                        innerView: WebView?,
                                        request: WebResourceRequest?
                                    ): Boolean {
                                        val targetUri = request?.url
                                        if (targetUri != null) {
                                            if (assetHandler.shouldIntercept(targetUri)) {
                                                webViewRef?.loadUrl(targetUri.toString())
                                            } else {
                                                openExternalUri(ctx, targetUri)
                                            }
                                        }
                                        innerView?.destroy()
                                        return true
                                    }
                                }
                            }
                            transport.webView = tempWebView
                            resultMsg.sendToTarget()
                            return true
                        }

                        override fun onShowCustomView(
                            view: View?,
                            callback: CustomViewCallback?
                        ) {
                            if (view == null) {
                                callback?.onCustomViewHidden()
                                return
                            }
                            customFullscreenView = view
                            customViewCallback = callback
                        }

                        override fun onHideCustomView() {
                            customFullscreenView = null
                            customViewCallback = null
                        }
                    }

                    loadUrl(AssetContentHandler.START_URL)
                    webViewRef = this
                }
            },
            onRelease = { webView ->
                webView.stopLoading()
                webView.destroy()
                if (webViewRef === webView) {
                    webViewRef = null
                }
            }
        )

        customFullscreenView?.let { fsView ->
            AndroidView(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.background),
                factory = { ctx ->
                    (fsView.parent as? ViewGroup)?.removeView(fsView)
                    FrameLayout(ctx).apply {
                        setBackgroundColor(AndroidColor.BLACK)
                        addView(
                            fsView,
                            FrameLayout.LayoutParams(
                                FrameLayout.LayoutParams.MATCH_PARENT,
                                FrameLayout.LayoutParams.MATCH_PARENT
                            )
                        )
                    }
                }
            )
        }

        if (hasLoadError) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.background)
                    .padding(24.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = stringResource(R.string.error_title),
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = {
                        hasLoadError = false
                        webViewRef?.loadUrl(AssetContentHandler.START_URL)
                    },
                    modifier = Modifier.testTag("retry_button"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    )
                ) {
                    Text(text = stringResource(R.string.retry))
                }
            }
        }
    }
}

private fun openExternalUri(context: Context, uri: Uri) {
    try {
        val intent = Intent(Intent.ACTION_VIEW, uri).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    } catch (_: Exception) {
        // Ignore if no handler is installed for custom scheme
    }
}
