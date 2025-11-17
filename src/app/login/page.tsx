'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { useLogin } from '@/hooks/useLogin'
import { Container } from '@mui/material'

export default function LoginPage() {
	const { register, handleSubmit, errors, isSubmitting, firebaseError, onSubmit } =
		useLogin()

	return (
		<Container component='main' maxWidth='xs'>
			<LoginForm
				register={register}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				errors={errors}
				isSubmitting={isSubmitting}
				firebaseError={firebaseError}
			/>
		</Container>
	)
}
