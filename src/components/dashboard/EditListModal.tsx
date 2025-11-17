'use client'

import { EditListFormData } from '@/types/todo.types'
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

interface EditListModalProps {
	open: boolean
	onClose: () => void
	register: UseFormRegister<EditListFormData>
	handleSubmit: (
		onSubmit: SubmitHandler<EditListFormData>,
	) => (e?: React.BaseSyntheticEvent) => Promise<void>
	onSubmit: SubmitHandler<EditListFormData>
	errors: FieldErrors<EditListFormData>
	isSubmitting: boolean
}

export const EditListModal: React.FC<EditListModalProps> = ({
	open,
	onClose,
	register,
	handleSubmit,
	onSubmit,
	errors,
	isSubmitting,
}) => {
	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-edit-list-title'>
			<Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate sx={modalStyle}>
				<Typography id='modal-edit-list-title' variant='h6' component='h2'>
					Edit List Name
				</Typography>
				<TextField
					margin='normal'
					required
					fullWidth
					id='editListName'
					label='New List Name'
					autoFocus
					{...register('editListName', {
						required: 'List name is required',
					})}
					error={!!errors.editListName}
					helperText={errors.editListName?.message as string}
					disabled={isSubmitting}
				/>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Saving...' : 'Save'}
				</Button>
			</Box>
		</Modal>
	)
}
