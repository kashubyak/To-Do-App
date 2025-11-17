'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React from 'react'

const theme = createTheme({
	palette: {
		mode: 'light',
	},
	typography: {
		fontFamily: 'var(--font-geist-sans)',
	},
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	return (
		<AppRouterCacheProvider options={{ key: 'mui' }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	)
}
