'use client'

import { AddMemberFormData, TodoList } from '@/types/todo.types'
import { decodeEmail, encodeEmail } from '@/utils/email.utils'
import {
	Alert,
	Box,
	Button,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import {
	Control,
	Controller,
	FieldErrors,
	SubmitHandler,
	UseFormHandleSubmit,
	UseFormRegister,
} from 'react-hook-form'

interface MemberManagerProps {
	listDetails: TodoList
	currentUserEmail: string
	memberError: string | null
	form: {
		isSubmitting: boolean
		register: UseFormRegister<AddMemberFormData>
		handleSubmit: UseFormHandleSubmit<AddMemberFormData>
		control: Control<AddMemberFormData>
		errors: FieldErrors<AddMemberFormData>
		onSubmit: SubmitHandler<AddMemberFormData>
	}
	onRemove: (safeEmail: string) => void
}

export const MemberManager: React.FC<MemberManagerProps> = ({
	listDetails,
	currentUserEmail,
	memberError,
	form,
	onRemove,
}) => (
	<Box
		component='form'
		onSubmit={form.handleSubmit(form.onSubmit)}
		noValidate
		sx={{
			width: '100%',
			p: 2,
			border: '1px solid #ddd',
			borderRadius: '4px',
			mb: 4,
			bgcolor: '#f9f9f9',
		}}
	>
		<Typography variant='h6' sx={{ mb: 2 }}>
			Manage Members
		</Typography>
		{memberError && (
			<Alert severity='error' sx={{ mb: 2 }}>
				{memberError}
			</Alert>
		)}
		<Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
			<TextField
				margin='none'
				required
				fullWidth
				id='memberEmail'
				label='Member Email'
				{...form.register('memberEmail', {
					required: 'Email is required',
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
						message: 'Invalid email',
					},
				})}
				error={!!form.errors.memberEmail}
				helperText={form.errors.memberEmail?.message as string}
				disabled={form.isSubmitting}
			/>
			<FormControl sx={{ minWidth: 120 }}>
				<InputLabel id='role-select-label'>Role</InputLabel>
				<Controller
					name='memberRole'
					control={form.control}
					render={({ field }) => (
						<Select labelId='role-select-label' id='memberRole' label='Role' {...field}>
							<MenuItem value={'viewer'}>Viewer</MenuItem>
							<MenuItem value={'admin'}>Admin</MenuItem>
						</Select>
					)}
				/>
			</FormControl>
			<Button
				type='submit'
				variant='contained'
				sx={{ height: '56px' }}
				disabled={form.isSubmitting}
			>
				{form.isSubmitting ? '...' : 'Add'}
			</Button>
		</Box>
		<Box sx={{ mt: 3 }}>
			<Typography variant='subtitle1'>Current Members:</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
				{Object.entries(listDetails.roles).map(([safeEmail, role]) => (
					<Chip
						key={safeEmail}
						label={`${decodeEmail(safeEmail)} (${role})`}
						color={role === 'admin' ? 'primary' : 'default'}
						onDelete={
							safeEmail !== encodeEmail(currentUserEmail)
								? () => onRemove(safeEmail)
								: undefined
						}
					/>
				))}
			</Box>
		</Box>
	</Box>
)
