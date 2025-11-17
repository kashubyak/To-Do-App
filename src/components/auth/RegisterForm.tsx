'use client'

import { ROUTES } from '@/constants/route'
import { RegisterFormData } from '@/types/auth.types'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form'

interface RegisterFormProps {
	register: UseFormRegister<RegisterFormData>
	handleSubmit: (
		onSubmit: SubmitHandler<RegisterFormData>,
	) => (e?: React.BaseSyntheticEvent) => Promise<void>
	onSubmit: SubmitHandler<RegisterFormData>
	password: string
	errors: FieldErrors<RegisterFormData>
	isSubmitting: boolean
	firebaseError: string | null
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
	register,
	handleSubmit,
	onSubmit,
	password,
	errors,
	isSubmitting,
	firebaseError,
}) => {
	return (
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
					<Link href={ROUTES.LOGIN} passHref>
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
	)
}
