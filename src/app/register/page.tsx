'use client'

import { RegisterForm } from '@/components/auth/RegisterForm'
import { useRegister } from '@/hooks/useRegister'
import { Container } from '@mui/material'

export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		password,
		errors,
		isSubmitting,
		firebaseError,
		onSubmit,
	} = useRegister()

	return (
		<Container component='main' maxWidth='xs'>
			<RegisterForm
				register={register}
				handleSubmit={handleSubmit}
				onSubmit={onSubmit}
				password={password}
				errors={errors}
				isSubmitting={isSubmitting}
				firebaseError={firebaseError}
			/>
		</Container>
	)
}
