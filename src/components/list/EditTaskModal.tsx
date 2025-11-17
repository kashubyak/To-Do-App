'use client'

import { EditTaskFormData } from '@/types/todo.types'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import {
	FieldErrors,
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form'

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

interface EditTaskModalProps {
	open: boolean
	onClose: () => void
	form: {
		isSubmitting: boolean
		register: UseFormRegister<EditTaskFormData>
		handleSubmit: UseFormHandleSubmit<EditTaskFormData>
		errors: FieldErrors<EditTaskFormData>
		onSubmit: SubmitHandler<EditTaskFormData>
	}
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ open, onClose, form }) => (
	<Modal open={open} onClose={onClose}>
		<Box
			component='form'
			onSubmit={form.handleSubmit(form.onSubmit)}
			noValidate
			sx={modalStyle}
		>
			<Typography variant='h6' component='h2'>
				Edit Task
			</Typography>
			<TextField
				margin='normal'
				required
				fullWidth
				id='editTaskTitle'
				label='Task Title'
				autoFocus
				{...form.register('editTaskTitle', { required: 'Task title is required' })}
				error={!!form.errors.editTaskTitle}
				helperText={form.errors.editTaskTitle?.message as string}
				disabled={form.isSubmitting}
			/>
			<TextField
				margin='normal'
				fullWidth
				id='editTaskDescription'
				label='Description (optional)'
				{...form.register('editTaskDescription')}
				disabled={form.isSubmitting}
			/>
			<Button
				type='submit'
				fullWidth
				variant='contained'
				sx={{ mt: 3, mb: 2 }}
				disabled={form.isSubmitting}
			>
				{form.isSubmitting ? 'Saving...' : 'Save Changes'}
			</Button>
		</Box>
	</Modal>
)
