'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth, db } from '@/lib/firebase'
import DeleteIcon from '@mui/icons-material/Delete' // <-- Іконка Видалити
import EditIcon from '@mui/icons-material/Edit' // <-- Іконка Редагувати
import {
	Box,
	Button,
	CircularProgress,
	Container,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Modal,
	TextField,
	Typography,
} from '@mui/material'
import { signOut } from 'firebase/auth'
import {
	FieldPath,
	addDoc,
	collection, // <-- Для оновлення
	deleteDoc,
	doc,
	onSnapshot,
	query, // <-- Для посилання на документ
	updateDoc,
	where,
} from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface TodoList {
	id: string
	name: string
	ownerId: string
	roles: Record<string, 'admin' | 'viewer'>
}

// Стиль для модального вікна
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

export default function DashboardPage() {
	const { user } = useAuth()
	const router = useRouter()

	const [todoLists, setTodoLists] = useState<TodoList[]>([])
	const [isLoadingLists, setIsLoadingLists] = useState(true)

	// --- Стан для модального вікна СТВОРЕННЯ (Create) ---
	const [openCreate, setOpenCreate] = useState(false)
	const handleOpenCreate = () => setOpenCreate(true)
	const handleCloseCreate = () => {
		setOpenCreate(false)
		resetCreate()
	}

	// --- Стан для модального вікна РЕДАГУВАННЯ (Edit) ---
	const [openEdit, setOpenEdit] = useState(false)
	const [currentList, setCurrentList] = useState<TodoList | null>(null)

	const handleOpenEdit = (list: TodoList) => {
		setCurrentList(list)
		setOpenEdit(true)
		// Встановлюємо початкове значення в формі редагування
		resetEdit({ editListName: list.name })
	}
	const handleCloseEdit = () => {
		setOpenEdit(false)
		setCurrentList(null)
		resetEdit()
	}

	// --- Форма СТВОРЕННЯ (Create) ---
	const {
		register: registerCreate,
		handleSubmit: handleSubmitCreate,
		reset: resetCreate,
		formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
	} = useForm()

	// --- Форма РЕДАГУВАННЯ (Edit) ---
	const {
		register: registerEdit,
		handleSubmit: handleSubmitEdit,
		reset: resetEdit,
		formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
	} = useForm()

	// --- Етап 4.1: Отримання списків (без змін) ---
	useEffect(() => {
		if (user && user.email) {
			setIsLoadingLists(true)
			const q = query(
				collection(db, 'todoLists'),
				where(new FieldPath('roles', user.email), 'in', ['admin', 'viewer']),
			)

			const unsubscribe = onSnapshot(
				q,
				querySnapshot => {
					const lists: TodoList[] = []
					querySnapshot.forEach(doc => {
						lists.push({ id: doc.id, ...doc.data() } as TodoList)
					})
					setTodoLists(lists)
					setIsLoadingLists(false)
				},
				error => {
					console.error('Помилка отримання списків:', error)
					setIsLoadingLists(false)
				},
			)
			return () => unsubscribe()
		}
	}, [user])

	// --- Етап 4.2: Створення списку ---
	const onSubmitListCreate: SubmitHandler<FieldValues> = async data => {
		if (!user || !user.email) return

		try {
			await addDoc(collection(db, 'todoLists'), {
				name: data.listName,
				ownerId: user.uid,
				roles: {
					[user.email]: 'admin',
				},
			})
			handleCloseCreate()
		} catch (error) {
			console.error('Помилка створення списку:', error)
		}
	}

	// --- Етап 4.3: Оновлення списку ---
	const onSubmitListEdit: SubmitHandler<FieldValues> = async data => {
		if (!currentList) return

		try {
			const listRef = doc(db, 'todoLists', currentList.id)
			await updateDoc(listRef, {
				name: data.editListName,
			})
			handleCloseEdit()
		} catch (error) {
			console.error('Помилка оновлення списку:', error)
		}
	}

	// --- Етап 4.3: Видалення списку ---
	const handleDeleteList = async (e: MouseEvent, listId: string) => {
		e.stopPropagation() // Зупиняємо клік, щоб не перейти на сторінку
		e.preventDefault()

		if (window.confirm('Ви впевнені, що хочете видалити цей список?')) {
			try {
				const listRef = doc(db, 'todoLists', listId)
				await deleteDoc(listRef)
			} catch (error) {
				console.error('Помилка видалення списку:', error)
			}
		}
	}

	const handleLogout = async () => {
		try {
			await signOut(auth)
			router.push('/login')
		} catch (error) {
			console.error('Помилка виходу:', error)
		}
	}

	// --- Функція для перевірки ролі ---
	const userIsAdmin = (list: TodoList): boolean => {
		return !!(user && user.email && list.roles[user.email] === 'admin')
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
				{/* --- Хедер --- */}
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 4,
					}}
				>
					<Typography component='h1' variant='h4'>
						Панель завдань
					</Typography>
					<Button variant='contained' color='error' onClick={handleLogout}>
						Вийти
					</Button>
				</Box>

				<Typography variant='h6' sx={{ mb: 2, alignSelf: 'flex-start' }}>
					Вітаємо, {user?.displayName || user?.email}!
				</Typography>

				{/* --- Секція Списків Завдань --- */}
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
							Ваші Списки
						</Typography>
						<Button variant='contained' onClick={handleOpenCreate}>
							+ Створити список
						</Button>
					</Box>

					{isLoadingLists && (
						<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
							<CircularProgress />
						</Box>
					)}

					{!isLoadingLists && todoLists.length === 0 && (
						<Typography>У вас поки немає доступних списків.</Typography>
					)}

					{!isLoadingLists && todoLists.length > 0 && (
						<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
							{todoLists.map(list => (
								<Link href={`/dashboard/list/${list.id}`} passHref key={list.id}>
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
										{/* --- Етап 4.3: Іконки Адміна --- */}
										{userIsAdmin(list) && (
											<Box sx={{ ml: 2 }}>
												<IconButton
													color='primary'
													onClick={e => {
														e.stopPropagation() // Не переходити на сторінку
														e.preventDefault()
														handleOpenEdit(list)
													}}
												>
													<EditIcon />
												</IconButton>
												<IconButton
													color='error'
													onClick={e => handleDeleteList(e, list.id)}
												>
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
			</Box>

			{/* --- Модальне вікно СТВОРЕННЯ (Create) --- */}
			<Modal
				open={openCreate}
				onClose={handleCloseCreate}
				aria-labelledby='modal-create-list-title'
			>
				<Box
					component='form'
					onSubmit={handleSubmitCreate(onSubmitListCreate)}
					noValidate
					sx={modalStyle}
				>
					<Typography id='modal-create-list-title' variant='h6' component='h2'>
						Створити новий список
					</Typography>
					<TextField
						margin='normal'
						required
						fullWidth
						id='listName'
						label='Назва списку'
						autoFocus
						{...registerCreate('listName', {
							required: "Назва списку обов'язкова",
						})}
						error={!!errorsCreate.listName}
						helperText={errorsCreate.listName?.message as string}
						disabled={isSubmittingCreate}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
						disabled={isSubmittingCreate}
					>
						{isSubmittingCreate ? 'Створення...' : 'Створити'}
					</Button>
				</Box>
			</Modal>

			{/* --- Модальне вікно РЕДАГУВАННЯ (Edit) --- */}
			<Modal
				open={openEdit}
				onClose={handleCloseEdit}
				aria-labelledby='modal-edit-list-title'
			>
				<Box
					component='form'
					onSubmit={handleSubmitEdit(onSubmitListEdit)}
					noValidate
					sx={modalStyle}
				>
					<Typography id='modal-edit-list-title' variant='h6' component='h2'>
						Редагувати список
					</Typography>
					<TextField
						margin='normal'
						required
						fullWidth
						id='editListName'
						label='Нова назва списку'
						autoFocus
						{...registerEdit('editListName', {
							required: "Назва списку обов'язкова",
						})}
						error={!!errorsEdit.editListName}
						helperText={errorsEdit.editListName?.message as string}
						disabled={isSubmittingEdit}
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
						disabled={isSubmittingEdit}
					>
						{isSubmittingEdit ? 'Збереження...' : 'Зберегти'}
					</Button>
				</Box>
			</Modal>
		</Container>
	)
}
