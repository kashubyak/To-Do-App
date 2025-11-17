'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading && !user) {
			router.replace('/login')
		}
	}, [user, loading, router])

	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	if (!user) {
		return null
	}

	return <>{children}</>
}
