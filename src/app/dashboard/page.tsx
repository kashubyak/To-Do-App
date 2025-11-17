'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { Box, Button, Container, Typography } from '@mui/material'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
	const { user } = useAuth()
	const router = useRouter()

	const handleLogout = async () => {
		try {
			await signOut(auth)
			router.push('/login')
		} catch (error) {
			console.error('Помилка виходу:', error)
		}
	}

	return (
		<Container component='main' maxWidth='md'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography component='h1' variant='h4'>
					Панель завдань
				</Typography>
				<Typography variant='h6' sx={{ mt: 2 }}>
					Вітаємо, {user?.displayName || user?.email}!
				</Typography>
				<Button variant='contained' color='error' onClick={handleLogout} sx={{ mt: 4 }}>
					Вийти
				</Button>
			</Box>
		</Container>
	)
}
