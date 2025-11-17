'use client'

import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { auth } from '@/lib/firebase'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function LoginPage() {
	const router = useRouter()
	const [firebaseError, setFirebaseError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm()

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setFirebaseError(null)

		try {
			await signInWithEmailAndPassword(auth, data.email, data.password)
			router.push('/dashboard')
		} catch (error: unknown) {
			console.error('Помилка входу:', error)

			if (error instanceof FirebaseError) {
				if (
					error.code === 'auth/user-not-found' ||
					error.code === 'auth/wrong-password' ||
					error.code === 'auth/invalid-credential'
				) {
					setFirebaseError('Неправильний email або пароль.')
				} else {
					setFirebaseError('Не вдалося увійти. Спробуйте пізніше.')
				}
			} else {
				setFirebaseError('Сталася невідома помилка.')
			}
		}
	}

	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
				className='p-4'
			>
				<Typography component='h1' variant='h5'>
					Вхід
				</Typography>
				<Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
					{firebaseError && (
						<Alert severity='error' sx={{ mb: 2, width: '100%' }}>
							{firebaseError}
						</Alert>
					)}
					<TextField
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Адреса'
						autoComplete='email'
						autoFocus
						{...register('email', {
							required: "Email обов'язковий",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: 'Некоректний email',
							},
						})}
						error={!!errors.email}
						helperText={errors.email?.message as string}
						disabled={isSubmitting}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						label='Пароль'
						type='password'
						id='password'
						autoComplete='current-password'
						{...register('password', {
							required: "Пароль обов'язковий",
						})}
						error={!!errors.password}
						helperText={errors.password?.message as string}
						disabled={isSubmitting}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Вхід...' : 'Увійти'}
					</Button>
					<div className='text-center'>
						<Link href='/register' passHref>
							<Typography
								variant='body2'
								component='a'
								className='text-blue-500 hover:underline'
							>
								{'Немає акаунту? Зареєструватися'}
							</Typography>
						</Link>
					</div>
				</Box>
			</Box>
		</Container>
	)
}
