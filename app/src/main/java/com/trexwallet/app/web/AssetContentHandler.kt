package com.trexwallet.app.web

import android.content.Context
import android.net.Uri
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.Locale

class AssetContentHandler(private val context: Context) {

    companion object {
        const val APP_HOST = "appassets.androidplatform.net"
        const val START_URL = "https://$APP_HOST/index.html"
    }

    fun shouldIntercept(uri: Uri): Boolean {
        return uri.scheme.equals("https", ignoreCase = true) &&
            uri.host.equals(APP_HOST, ignoreCase = true)
    }

    fun handleRequest(request: WebResourceRequest): WebResourceResponse? {
        val uri = request.url
        if (!shouldIntercept(uri)) return null

        val rawPath = uri.path ?: "/index.html"
        val normalizedPath = normalizeAssetPath(rawPath) ?: return notFoundResponse()
        val mimeType = resolveMimeType(normalizedPath)

        return try {
            if (request.method.equals("HEAD", ignoreCase = true)) {
                context.assets.open(normalizedPath).use { }
                return WebResourceResponse(
                    mimeType,
                    "UTF-8",
                    200,
                    "OK",
                    mapOf(
                        "Access-Control-Allow-Origin" to "*",
                        "Cache-Control" to "no-cache"
                    ),
                    ByteArrayInputStream(ByteArray(0))
                )
            }

            val rangeHeader = request.requestHeaders?.entries
                ?.firstOrNull { it.key.equals("Range", ignoreCase = true) }
                ?.value

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                handleRangeRequest(normalizedPath, mimeType, rangeHeader)
            } else {
                val inputStream = context.assets.open(normalizedPath)
                WebResourceResponse(
                    mimeType,
                    "UTF-8",
                    200,
                    "OK",
                    mapOf(
                        "Access-Control-Allow-Origin" to "*",
                        "Accept-Ranges" to "bytes"
                    ),
                    inputStream
                )
            }
        } catch (_: Exception) {
            null
        }
    }

    private fun handleRangeRequest(
        assetPath: String,
        mimeType: String,
        rangeHeader: String
    ): WebResourceResponse {
        val allBytes = context.assets.open(assetPath).use { it.readBytes() }
        val totalLength = allBytes.size.toLong()
        if (totalLength == 0L) {
            return WebResourceResponse(
                mimeType,
                "UTF-8",
                200,
                "OK",
                mapOf("Access-Control-Allow-Origin" to "*"),
                ByteArrayInputStream(allBytes)
            )
        }

        val rangeSpec = rangeHeader.removePrefix("bytes=").substringBefore(",").trim()
        val parts = rangeSpec.split("-")
        val start = parts.getOrNull(0)?.toLongOrNull() ?: 0L
        val endRaw = parts.getOrNull(1)?.toLongOrNull()
        val end = (endRaw ?: (totalLength - 1)).coerceAtMost(totalLength - 1)

        if (start < 0 || start > end || start >= totalLength) {
            return WebResourceResponse(
                mimeType,
                "UTF-8",
                416,
                "Range Not Satisfiable",
                mapOf("Content-Range" to "bytes */$totalLength"),
                ByteArrayInputStream(ByteArray(0))
            )
        }

        val length = (end - start + 1).toInt()
        val sliceStream: InputStream = ByteArrayInputStream(allBytes, start.toInt(), length)

        return WebResourceResponse(
            mimeType,
            "UTF-8",
            206,
            "Partial Content",
            mapOf(
                "Access-Control-Allow-Origin" to "*",
                "Accept-Ranges" to "bytes",
                "Content-Range" to "bytes $start-$end/$totalLength",
                "Content-Length" to length.toString()
            ),
            sliceStream
        )
    }

    private fun normalizeAssetPath(rawPath: String): String? {
        val trimmed = rawPath.trimStart('/')
        val target = if (trimmed.isEmpty()) "index.html" else trimmed
        val segments = target.split("/").filter { it.isNotEmpty() && it != "." }
        if (segments.any { it == ".." }) return null
        return segments.joinToString("/")
    }

    private fun notFoundResponse(): WebResourceResponse {
        return WebResourceResponse(
            "text/plain",
            "UTF-8",
            404,
            "Not Found",
            mapOf("Access-Control-Allow-Origin" to "*"),
            ByteArrayInputStream(ByteArray(0))
        )
    }

    private fun resolveMimeType(path: String): String {
        val lower = path.lowercase(Locale.US)
        return when {
            lower.endsWith(".html") || lower.endsWith(".htm") -> "text/html"
            lower.endsWith(".js") || lower.endsWith(".mjs") -> "application/javascript"
            lower.endsWith(".css") -> "text/css"
            lower.endsWith(".json") -> "application/json"
            lower.endsWith(".png") -> "image/png"
            lower.endsWith(".jpg") || lower.endsWith(".jpeg") -> "image/jpeg"
            lower.endsWith(".webp") -> "image/webp"
            lower.endsWith(".gif") -> "image/gif"
            lower.endsWith(".svg") -> "image/svg+xml"
            lower.endsWith(".mp4") -> "video/mp4"
            lower.endsWith(".webm") -> "video/webm"
            lower.endsWith(".woff2") -> "font/woff2"
            lower.endsWith(".woff") -> "font/woff"
            lower.endsWith(".ttf") -> "font/ttf"
            else -> "application/octet-stream"
        }
    }
}
