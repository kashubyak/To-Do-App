import { ROUTES } from '@/constants/route'
import { loginUser } from '@/services/auth.service'
import { LoginFormData } from '@/types/login-form-data'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useLogin = () => {
	const router = useRouter()
	const [firebaseError, setFirebaseError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>()

	const onSubmit: SubmitHandler<LoginFormData> = async data => {
		setFirebaseError(null)

		try {
			await loginUser(data.email, data.password)
			router.push(ROUTES.DASHBOARD)
		} catch (error: unknown) {
			console.error('Login Error:', error)
			if (error instanceof FirebaseError) {
				if (
					error.code === 'auth/user-not-found' ||
					error.code === 'auth/wrong-password' ||
					error.code === 'auth/invalid-credential'
				)
					setFirebaseError('Invalid email or password.')
				else setFirebaseError('Failed to sign in. Please try again later.')
			} else {
				setFirebaseError('An unknown error occurred.')
			}
		}
	}

	return {
		register,
		handleSubmit,
		errors,
		isSubmitting,
		firebaseError,
		onSubmit,
	}
}
