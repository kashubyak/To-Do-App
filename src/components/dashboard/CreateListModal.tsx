'use client'

import { CreateListFormData } from '@/types/todo.types'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { FieldErrors, SubmitHandler, UseFormRegister } from 'react-hook-form'

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
}

interface CreateListModalProps {
	open: boolean
	onClose: () => void
	register: UseFormRegister<CreateListFormData>
	handleSubmit: (
		onSubmit: SubmitHandler<CreateListFormData>,
	) => (e?: React.BaseSyntheticEvent) => Promise<void>
	onSubmit: SubmitHandler<CreateListFormData>
	errors: FieldErrors<CreateListFormData>
	isSubmitting: boolean
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
	open,
	onClose,
	register,
	handleSubmit,
	onSubmit,
	errors,
	isSubmitting,
}) => {
	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-create-list-title'>
			<Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={modalStyle}>
				<Typography id='modal-create-list-title' variant='h6' component='h2'>
					Create New List
				</Typography>
				<TextField
					margin='normal'
					required
					fullWidth
					id='listName'
					label='List Name'
					autoFocus
					{...register('listName', {
						required: 'List name is required',
					})}
					error={!!errors.listName}
					helperText={errors.listName?.message as string}
					disabled={isSubmitting}
				/>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Creating...' : 'Create'}
				</Button>
			</Box>
		</Modal>
	)
}
