'use client'

import { ROUTES } from '@/constants/route'
import { useAuth } from '@/contexts/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const { user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading) {
			if (user) router.replace(ROUTES.DASHBOARD)
			else router.replace(ROUTES.LOGIN)
		}
	}, [user, loading, router])

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
