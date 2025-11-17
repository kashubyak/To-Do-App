'use client'

import { Task, UserRole } from '@/types/todo.types'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
	Box,
	Checkbox,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material'

interface TaskListProps {
	tasks: Task[]
	userRole: UserRole
	onToggle: (task: Task) => void
	onDelete: (taskId: string) => void
	onOpenEdit: (task: Task) => void
}

export const TaskList: React.FC<TaskListProps> = ({
	tasks,
	userRole,
	onToggle,
	onDelete,
	onOpenEdit,
}) => (
	<Box sx={{ width: '100%' }}>
		<Typography component='h2' variant='h5' sx={{ mb: 2 }}>
			Tasks
		</Typography>
		{tasks.length === 0 && <Typography>This list has no tasks yet.</Typography>}
		<List sx={{ width: '100%' }}>
			{tasks.map(task => (
				<ListItem
					key={task.id}
					sx={{
						border: '1px solid #ddd',
						borderRadius: '4px',
						mb: 1,
						bgcolor: task.completed ? '#f0f0f0' : 'background.paper',
					}}
					secondaryAction={
						userRole === 'admin' ? (
							<>
								<IconButton
									edge='end'
									aria-label='edit'
									onClick={() => onOpenEdit(task)}
									sx={{ mr: 1 }}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									edge='end'
									aria-label='delete'
									onClick={() => onDelete(task.id)}
								>
									<DeleteIcon color='error' />
								</IconButton>
							</>
						) : null
					}
				>
					<Checkbox
						edge='start'
						checked={task.completed}
						tabIndex={-1}
						disableRipple
						onChange={() => onToggle(task)}
					/>
					<ListItemText
						primary={task.title}
						secondary={task.description}
						sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
					/>
				</ListItem>
			))}
		</List>
	</Box>
)
