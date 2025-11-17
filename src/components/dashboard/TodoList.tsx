'use client'

import { ROUTES } from '@/constants/route'
import { TodoList } from '@/types/todo.types'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
	Box,
	Button,
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material'
import Link from 'next/link'
import { MouseEvent } from 'react'

interface TodoListProps {
	isLoading: boolean
	lists: TodoList[]
	onOpenCreate: () => void
	onOpenEdit: (list: TodoList) => void
	onDelete: (e: MouseEvent, listId: string) => void
	userIsAdmin: (list: TodoList) => boolean
}

export const TodoLists: React.FC<TodoListProps> = ({
	isLoading,
	lists,
	onOpenCreate,
	onOpenEdit,
	onDelete,
	userIsAdmin,
}) => {
	return (
		<Box sx={{ width: '100%', mt: 4 }}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 2,
				}}
			>
				<Typography component='h2' variant='h5'>
					Your Lists
				</Typography>
				<Button variant='contained' onClick={onOpenCreate}>
					+ Create List
				</Button>
			</Box>

			{isLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{!isLoading && lists.length === 0 && (
				<Typography>You don't have any lists available yet.</Typography>
			)}

			{!isLoading && lists.length > 0 && (
				<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
					{lists.map(list => (
						<Link href={`${ROUTES.DASHBOARD}/list/${list.id}`} passHref key={list.id}>
							<ListItem
								component='a'
								sx={{
									border: '1px solid #ddd',
									borderRadius: '4px',
									mb: 1,
									cursor: 'pointer',
									'&:hover': { bgcolor: '#f5f5f5' },
								}}
							>
								<ListItemText primary={list.name} />
								{userIsAdmin(list) && (
									<Box sx={{ ml: 2 }}>
										<IconButton
											color='primary'
											onClick={e => {
												e.stopPropagation()
												e.preventDefault()
												onOpenEdit(list)
											}}
										>
											<EditIcon />
										</IconButton>
										<IconButton color='error' onClick={e => onDelete(e, list.id)}>
											<DeleteIcon />
										</IconButton>
									</Box>
								)}
							</ListItem>
						</Link>
					))}
				</List>
			)}
		</Box>
	)
}
