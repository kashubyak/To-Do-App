'use client'

import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { auth, db } from '@/lib/firebase'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default function RegisterPage() {
	const router = useRouter()
	const [firebaseError, setFirebaseError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm()

	const password = watch('password')

	const onSubmit: SubmitHandler<FieldValues> = async data => {
		setFirebaseError(null)

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			)
			const user = userCredential.user

			await setDoc(doc(db, 'users', user.uid), {
				uid: user.uid,
				name: data.name,
				email: data.email,
			})

			router.push('/login')
		} catch (error: unknown) {
			console.error('Помилка реєстрації:', error)

			if (error instanceof FirebaseError) {
				if (error.code === 'auth/email-already-in-use')
					setFirebaseError('Цей email вже зареєстровано.')
				else setFirebaseError('Не вдалося створити акаунт. Спробуйте пізніше.')
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
					Реєстрація
				</Typography>
				<Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
					{firebaseError && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{firebaseError}
						</Alert>
					)}

					<TextField
						margin='normal'
						required
						fullWidth
						id='name'
						label="Ваше ім'я"
						autoComplete='name'
						autoFocus
						{...register('name', {
							required: "Ім'я обов'язкове",
						})}
						error={!!errors.name}
						helperText={errors.name?.message as string}
						disabled={isSubmitting}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Адреса'
						autoComplete='email'
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
						autoComplete='new-password'
						{...register('password', {
							required: "Пароль обов'язковий",
							minLength: {
								value: 6,
								message: 'Пароль має бути мінімум 6 символів',
							},
						})}
						error={!!errors.password}
						helperText={errors.password?.message as string}
						disabled={isSubmitting}
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						label='Повторіть Пароль'
						type='password'
						id='confirmPassword'
						{...register('confirmPassword', {
							required: "Підтвердження паролю обов'язкове",
							validate: value => value === password || 'Паролі не співпадають',
						})}
						error={!!errors.confirmPassword}
						helperText={errors.confirmPassword?.message as string}
						disabled={isSubmitting}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
					</Button>
					<div className='text-center'>
						<Link href='/login' passHref>
							<Typography
								variant='body2'
								component='a'
								className='text-blue-500 hover:underline'
							>
								{'Вже маєте акаунт? Увійти'}
							</Typography>
						</Link>
					</div>
				</Box>
			</Box>
		</Container>
	)
}
