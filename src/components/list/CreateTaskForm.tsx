'use client'

import { CreateTaskFormData } from '@/types/todo.types'
import { Box, Button, TextField, Typography } from '@mui/material'
import {
	FieldErrors,
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form'

interface CreateTaskFormProps {
	form: {
		isSubmitting: boolean
		register: UseFormRegister<CreateTaskFormData>
		handleSubmit: UseFormHandleSubmit<CreateTaskFormData>
		errors: FieldErrors<CreateTaskFormData>
		onSubmit: SubmitHandler<CreateTaskFormData>
	}
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ form }) => (
	<Box
		component='form'
		onSubmit={form.handleSubmit(form.onSubmit)}
		noValidate
		sx={{ width: '100%', p: 2, border: '1px solid #ddd', borderRadius: '4px', mb: 4 }}
	>
		<Typography variant='h6' sx={{ mb: 1 }}>
			Add New Task
		</Typography>
		<TextField
			margin='normal'
			required
			fullWidth
			id='taskTitle'
			label='Task Title'
			autoFocus
			{...form.register('taskTitle', { required: 'Task title is required' })}
			error={!!form.errors.taskTitle}
			helperText={form.errors.taskTitle?.message as string}
			disabled={form.isSubmitting}
		/>
		<TextField
			margin='normal'
			fullWidth
			id='taskDescription'
			label='Description (optional)'
			{...form.register('taskDescription')}
			disabled={form.isSubmitting}
		/>
		<Button type='submit' variant='contained' sx={{ mt: 2 }} disabled={form.isSubmitting}>
			{form.isSubmitting ? 'Adding...' : 'Add Task'}
		</Button>
	</Box>
)
