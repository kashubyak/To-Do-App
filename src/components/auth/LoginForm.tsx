'use client'

import { ROUTES } from '@/constants/route'
import { LoginFormData } from '@/types/login-form-data'
import { Alert, Box, Button, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form'

interface LoginFormProps {
	register: UseFormRegister<LoginFormData>
	handleSubmit: (
		onSubmit: SubmitHandler<LoginFormData>,
	) => (e?: React.BaseSyntheticEvent) => Promise<void>
	onSubmit: SubmitHandler<LoginFormData>
	errors: FieldErrors<LoginFormData>
	isSubmitting: boolean
	firebaseError: string | null
}

export const LoginForm: React.FC<LoginFormProps> = ({
	register,
	handleSubmit,
	onSubmit,
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
				Sign In
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
					label='Email Address'
					autoComplete='email'
					autoFocus
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
					autoComplete='current-password'
					{...register('password', {
						required: 'Password is required',
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
					{isSubmitting ? 'Signing In...' : 'Sign In'}
				</Button>
				<div className='text-center'>
					<Link href={ROUTES.REGISTER} passHref>
						<Typography
							variant='body2'
							component='a'
							className='text-blue-500 hover:underline'
						>
							{"Don't have an account? Sign Up"}
						</Typography>
					</Link>
				</div>
			</Box>
		</Box>
	)
}
