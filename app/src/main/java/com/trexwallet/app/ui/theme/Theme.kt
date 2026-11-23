package com.trexwallet.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.trexwallet.app.R

val PureBlack = Color(0xFF000000)
val DarkSurface = Color(0xFF060608)
val DarkBorder = Color(0xFF1B1B22)
val PureWhite = Color(0xFFFFFFFF)
val MutedGray = Color(0xFF8C8C98)
val AccentGreen = Color(0xFF22C55E)
val AccentRed = Color(0xFFFF1F1F)

val InterFontFamily = FontFamily(
    Font(R.font.inter, FontWeight.Normal),
    Font(R.font.inter, FontWeight.Bold),
    Font(R.font.inter, FontWeight.ExtraBold)
)

val JetBrainsMonoFontFamily = FontFamily(
    Font(R.font.jetbrains_mono, FontWeight.Bold)
)

private val TrexDarkColorScheme = darkColorScheme(
    primary = PureWhite,
    onPrimary = PureBlack,
    secondary = AccentGreen,
    onSecondary = PureBlack,
    background = PureBlack,
    onBackground = PureWhite,
    surface = DarkSurface,
    onSurface = PureWhite,
    surfaceVariant = DarkBorder,
    onSurfaceVariant = MutedGray,
    error = AccentRed,
    onError = PureWhite
)

val TrexTypography = Typography(
    headlineSmall = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = InterFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelLarge = TextStyle(
        fontFamily = JetBrainsMonoFontFamily,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )
)

@Composable
fun TrexwalletTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = TrexDarkColorScheme,
        typography = TrexTypography,
        content = content
    )
}
