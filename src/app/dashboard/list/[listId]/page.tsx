'use client'

import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import DeleteIcon from '@mui/icons-material/Delete'
import {
	Alert,
	Box,
	Breadcrumbs,
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	Container,
	FormControl,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
	writeBatch,
	deleteField, // <-- ОСЬ ВИПРАВЛЕННЯ
} from 'firebase/firestore'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface Task {
	id: string
	title: string
	description: string
	completed: boolean
}

interface TodoList {
	id: string
	name: string
	ownerId: string
	roles: Record<string, 'admin' | 'viewer'>
}

type UserRole = 'admin' | 'viewer' | null

const encodeEmail = (email: string) => email.replace(/\./g, '_DOT_')
const decodeEmail = (safeEmail: string) => safeEmail.replace(/_DOT_/g, '.')

export default function ListPage() {
	const { user } = useAuth()
	const router = useRouter()
	const params = useParams()
	const listId = params.listId as string

	const [listDetails, setListDetails] = useState<TodoList | null>(null)
	const [tasks, setTasks] = useState<Task[]>([])
	const [userRole, setUserRole] = useState<UserRole>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [memberError, setMemberError] = useState<string | null>(null)

	const {
		register: registerCreate,
		handleSubmit: handleSubmitCreate,
		reset: resetCreate,
		formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
	} = useForm()

	const {
		register: registerMember,
		handleSubmit: handleSubmitMember,
		control: controlMember,
		reset: resetMember,
		formState: { errors: errorsMember, isSubmitting: isSubmittingMember },
	} = useForm({
		defaultValues: {
			memberEmail: '',
			memberRole: 'viewer',
		},
	})

	useEffect(() => {
		if (!user || !user.email || !listId) return

		const listRef = doc(db, 'todoLists', listId)
		const unsubscribe = onSnapshot(
			listRef,
			docSnap => {
				if (docSnap.exists()) {
					const listData = { id: docSnap.id, ...docSnap.data() } as TodoList
					setListDetails(listData)

					const safeEmail = encodeEmail(user.email!)
					const role = listData.roles[safeEmail]

					if (role === 'admin' || role === 'viewer') {
						setUserRole(role)
					} else {
						setUserRole(null)
						router.replace('/dashboard')
					}
				} else {
					console.error('Список не знайдено')
					router.replace('/dashboard')
				}
				setIsLoading(false)
			},
			error => {
				console.error('Помилка завантаження списку:', error)
				router.replace('/dashboard')
			},
		)
		return () => unsubscribe()
	}, [user, listId, router])

	useEffect(() => {
		if (!listId) return
		const tasksCollectionRef = collection(db, 'todoLists', listId, 'tasks')
		const q = query(tasksCollectionRef)
		const unsubscribe = onSnapshot(
			q,
			querySnapshot => {
				const tasksData: Task[] = []
				querySnapshot.forEach(doc => {
					tasksData.push({ id: doc.id, ...doc.data() } as Task)
				})
				setTasks(tasksData)
			},
			error => {
				console.error('Помилка завантаження завдань:', error)
			},
		)
		return () => unsubscribe()
	}, [listId])

	const onSubmitTaskCreate: SubmitHandler<FieldValues> = async data => {
		if (userRole !== 'admin') return
		try {
			const tasksCollectionRef = collection(db, 'todoLists', listId, 'tasks')
			await addDoc(tasksCollectionRef, {
				title: data.taskTitle,
				description: data.taskDescription || '',
				completed: false,
			})
			resetCreate()
		} catch (error) {
			console.error('Помилка створення завдання:', error)
		}
	}

	const handleToggleTask = async (task: Task) => {
		if (!userRole) return
		try {
			const taskRef = doc(db, 'todoLists', listId, 'tasks', task.id)
			await updateDoc(taskRef, {
				completed: !task.completed,
			})
		} catch (error) {
			console.error('Помилка оновлення статусу:', error)
		}
	}

	const handleDeleteTask = async (taskId: string) => {
		if (userRole !== 'admin') return
		if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
			try {
				const taskRef = doc(db, 'todoLists', listId, 'tasks', taskId)
				await deleteDoc(taskRef)
			} catch (error) {
				console.error('Помилка видалення завдання:', error)
			}
		}
	}

	const onAddMember: SubmitHandler<FieldValues> = async data => {
		if (userRole !== 'admin' || !listDetails || !user) return
		setMemberError(null)

		const emailToAdd = data.memberEmail
		const roleToAdd = data.memberRole

		if (emailToAdd === user?.email) {
			setMemberError('Ви не можете додати самого себе.')
			return
		}

		const safeEmailToAdd = encodeEmail(emailToAdd)

		if (listDetails.roles[safeEmailToAdd]) {
			setMemberError('Цей користувач вже є учасником.')
			return
		}

		try {
			const usersRef = collection(db, 'users')
			const q = query(usersRef, where('email', '==', emailToAdd))
			const querySnapshot = await getDocs(q)

			if (querySnapshot.empty) {
				setMemberError('Користувача з таким email не знайдено.')
				return
			}

			const listRef = doc(db, 'todoLists', listId)
			await updateDoc(listRef, {
				[`roles.${safeEmailToAdd}`]: roleToAdd,
			})
			resetMember()
		} catch (error) {
			console.error('Помилка додавання учасника:', error)
			setMemberError('Сталася помилка. Спробуйте пізніше.')
		}
	}

	const handleRemoveMember = async (safeEmailToRemove: string) => {
		if (userRole !== 'admin' || !listDetails || !user) return

		const safeCurrentUserEmail = encodeEmail(user.email!)
		if (safeEmailToRemove === safeCurrentUserEmail) {
			setMemberError('Ви не можете видалити себе.')
			return
		}

		if (
			window.confirm(`Ви впевнені, що хочете видалити ${decodeEmail(safeEmailToRemove)}?`)
		) {
			try {
				const listRef = doc(db, 'todoLists', listId)

				const batch = writeBatch(db)
				batch.update(listRef, {
					[`roles.${safeEmailToRemove}`]: deleteField(),
				})
				await batch.commit()
			} catch (error) {
				console.error('Помилка видалення учасника:', error)
			}
		}
	}

	if (isLoading || !listDetails || !userRole) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Container component='main' maxWidth='md'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Breadcrumbs aria-label='breadcrumb' sx={{ alignSelf: 'flex-start', mb: 2 }}>
					<Link href='/dashboard'>
						<Typography
							sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
						>
							Панель завдань
						</Typography>
					</Link>
					<Typography color='text.primary'>{listDetails.name}</Typography>
				</Breadcrumbs>

				<Typography component='h1' variant='h4' sx={{ mb: 4, alignSelf: 'flex-start' }}>
					{listDetails.name}
				</Typography>

				{userRole === 'admin' && (
					<Box
						component='form'
						onSubmit={handleSubmitMember(onAddMember)}
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
							Управління учасниками
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
								label='Email учасника'
								{...registerMember('memberEmail', {
									required: 'Email обовʼязковий',
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: 'Некоректний email',
									},
								})}
								error={!!errorsMember.memberEmail}
								helperText={errorsMember.memberEmail?.message as string}
								disabled={isSubmittingMember}
							/>
							<FormControl sx={{ minWidth: 120 }}>
								<InputLabel id='role-select-label'>Роль</InputLabel>
								<Controller
									name='memberRole'
									control={controlMember}
									render={({ field }) => (
										<Select
											labelId='role-select-label'
											id='memberRole'
											label='Роль'
											{...field}
										>
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
								disabled={isSubmittingMember}
							>
								{isSubmittingMember ? '...' : 'Додати'}
							</Button>
						</Box>

						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle1'>Поточні учасники:</Typography>
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
								{Object.entries(listDetails.roles).map(([safeEmail, role]) => (
									<Chip
										key={safeEmail}
										label={`${decodeEmail(safeEmail)} (${role})`}
										color={role === 'admin' ? 'primary' : 'default'}
										onDelete={
											safeEmail !== encodeEmail(user?.email || '')
												? () => handleRemoveMember(safeEmail)
												: undefined
										}
									/>
								))}
							</Box>
						</Box>
					</Box>
				)}

				{userRole === 'admin' && (
					<Box
						component='form'
						onSubmit={handleSubmitCreate(onSubmitTaskCreate)}
						noValidate
						sx={{
							width: '100%',
							p: 2,
							border: '1px solid #ddd',
							borderRadius: '4px',
							mb: 4,
						}}
					>
						<Typography variant='h6' sx={{ mb: 1 }}>
							Додати нове завдання
						</Typography>
						<TextField
							margin='normal'
							required
							fullWidth
							id='taskTitle'
							label='Назва завдання'
							autoFocus
							{...registerCreate('taskTitle', {
								required: 'Назва завдання обовʼязкова',
							})}
							error={!!errorsCreate.taskTitle}
							helperText={errorsCreate.taskTitle?.message as string}
							disabled={isSubmittingCreate}
						/>
						<TextField
							margin='normal'
							fullWidth
							id='taskDescription'
							label='Опис (необовʼязково)'
							{...registerCreate('taskDescription')}
							disabled={isSubmittingCreate}
						/>
						<Button
							type='submit'
							variant='contained'
							sx={{ mt: 2 }}
							disabled={isSubmittingCreate}
						>
							{isSubmittingCreate ? 'Додавання...' : 'Додати'}
						</Button>
					</Box>
				)}

				<Box sx={{ width: '100%' }}>
					<Typography component='h2' variant='h5' sx={{ mb: 2 }}>
						Завдання
					</Typography>
					{tasks.length === 0 && (
						<Typography>У цьому списку ще немає завдань.</Typography>
					)}
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
												aria-label='delete'
												onClick={() => handleDeleteTask(task.id)}
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
									onChange={() => handleToggleTask(task)}
								/>
								<ListItemText
									primary={task.title}
									secondary={task.description}
									sx={{
										textDecoration: task.completed ? 'line-through' : 'none',
									}}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Box>
		</Container>
	)
}