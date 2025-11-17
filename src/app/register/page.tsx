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
			console.error('Registration Error:', error)

			if (error instanceof FirebaseError) {
				if (error.code === 'auth/email-already-in-use') {
					setFirebaseError('This email is already registered.')
				} else {
					setFirebaseError('Failed to create an account. Please try again later.')
				}
			} else {
				setFirebaseError('An unknown error occurred.')
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
					Sign Up
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
						label='Your Name'
						autoComplete='name'
						autoFocus
						{...register('name', {
							required: 'Name is required',
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
						label='Email Address'
						autoComplete='email'
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: 'Invalid email address',
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
						label='Password'
						type='password'
						id='password'
						autoComplete='new-password'
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters',
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
						label='Confirm Password'
						type='password'
						id='confirmPassword'
						{...register('confirmPassword', {
							required: 'Password confirmation is required',
							validate: value => value === password || 'Passwords do not match',
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
						{isSubmitting ? 'Signing Up...' : 'Sign Up'}
					</Button>
					<div className='text-center'>
						<Link href='/login' passHref>
							<Typography
								variant='body2'
								component='a'
								className='text-blue-500 hover:underline'
							>
								{'Already have an account? Sign In'}
							</Typography>
						</Link>
					</div>
				</Box>
			</Box>
		</Container>
	)
}
