'use client'

import { auth } from '@/lib/firebase'
import { Box, CircularProgress } from '@mui/material'
import { onAuthStateChanged, User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	user: User | null
	loading: boolean
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setUser(user)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{loading ? (
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
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
