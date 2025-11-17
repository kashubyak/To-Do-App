'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Box, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
	const { user, loading } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (!loading) {
			if (user) router.replace('/dashboard')
			else router.replace('/login')
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
