package com.trexwallet.app

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.trexwallet.app.ui.TrexWebViewScreen
import com.trexwallet.app.ui.theme.TrexwalletTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(Color.BLACK),
            navigationBarStyle = SystemBarStyle.dark(Color.BLACK)
        )
        super.onCreate(savedInstanceState)
        setContent {
            TrexwalletTheme {
                TrexWebViewScreen()
            }
        }
    }
}
