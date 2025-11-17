import { ROUTES } from '@/constants/route'
import { registerUser } from '@/services/auth.service'
import { RegisterFormData } from '@/types/auth.types'
import { FirebaseError } from 'firebase/app'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useRegister = () => {
	const router = useRouter()
	const [firebaseError, setFirebaseError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm<RegisterFormData>()

	const password = watch('password')

	const onSubmit: SubmitHandler<RegisterFormData> = async data => {
		setFirebaseError(null)

		try {
			await registerUser(data.name, data.email, data.password)
			router.push(ROUTES.LOGIN)
		} catch (error: unknown) {
			console.error('Registration Error:', error)
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/email-already-in-use')
					setFirebaseError('This email is already registered.')
				else setFirebaseError('Failed to create an account. Please try again later.')
			} else {
				setFirebaseError('An unknown error occurred.')
			}
		}
	}

	return {
		register,
		handleSubmit,
		password,
		errors,
		isSubmitting,
		firebaseError,
		onSubmit,
	}
}
