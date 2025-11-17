import { ROUTES } from '@/constants/route'
import { useAuth } from '@/contexts/AuthContext'
import { logoutUser } from '@/services/auth.service'
import {
	createTodoList,
	deleteTodoList,
	getTodoListsListener,
	updateTodoListName,
} from '@/services/todo.service'
import { CreateListFormData, EditListFormData, TodoList } from '@/types/todo.types'
import { encodeEmail } from '@/utils/email.utils'
import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useDashboard = () => {
	const { user } = useAuth()
	const router = useRouter()

	const [todoLists, setTodoLists] = useState<TodoList[]>([])
	const [isLoadingLists, setIsLoadingLists] = useState(true)

	const safeEmail = useMemo(
		() => (user?.email ? encodeEmail(user.email) : null),
		[user?.email],
	)

	useEffect(() => {
		if (safeEmail) {
			setIsLoadingLists(true)
			const unsubscribe = getTodoListsListener(safeEmail, (lists: TodoList[]) => {
				setTodoLists(lists)
				setIsLoadingLists(false)
			})
			return () => unsubscribe()
		} else {
			setIsLoadingLists(false)
			setTodoLists([])
		}
	}, [safeEmail])

	const handleLogout = async () => {
		try {
			await logoutUser()
			router.push(ROUTES.LOGIN)
		} catch (error) {
			console.error('Logout Error:', error)
		}
	}

	const [openCreate, setOpenCreate] = useState(false)
	const handleOpenCreate = () => setOpenCreate(true)
	const handleCloseCreate = () => {
		setOpenCreate(false)
		resetCreate()
	}
	const {
		register: registerCreate,
		handleSubmit: handleSubmitCreate,
		reset: resetCreate,
		formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
	} = useForm<CreateListFormData>()

	const onSubmitCreate: SubmitHandler<CreateListFormData> = async data => {
		if (!user || !safeEmail) return
		try {
			await createTodoList(data.listName, user.uid, safeEmail)
			handleCloseCreate()
		} catch (error) {
			console.error('Create List Error:', error)
		}
	}

	const [openEdit, setOpenEdit] = useState(false)
	const [currentList, setCurrentList] = useState<TodoList | null>(null)
	const {
		register: registerEdit,
		handleSubmit: handleSubmitEdit,
		reset: resetEdit,
		setValue: setEditValue,
		formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
	} = useForm<EditListFormData>()

	const handleOpenEdit = (list: TodoList) => {
		setCurrentList(list)
		setEditValue('editListName', list.name)
		setOpenEdit(true)
	}
	const handleCloseEdit = () => {
		setOpenEdit(false)
		setCurrentList(null)
		resetEdit()
	}

	const onSubmitEdit: SubmitHandler<EditListFormData> = async data => {
		if (!currentList) return
		try {
			await updateTodoListName(currentList.id, data.editListName)
			handleCloseEdit()
		} catch (error) {
			console.error('Update List Error:', error)
		}
	}

	const handleDelete = async (e: MouseEvent, listId: string) => {
		e.stopPropagation()
		e.preventDefault()
		if (window.confirm('Are you sure you want to delete this list?')) {
			try {
				await deleteTodoList(listId)
			} catch (error) {
				console.error('Delete List Error:', error)
			}
		}
	}

	const userIsAdmin = (list: TodoList): boolean => {
		if (!safeEmail) return false
		return list.roles[safeEmail] === 'admin'
	}

	return {
		user,
		handleLogout,
		todoLists,
		isLoadingLists,
		userIsAdmin,
		handleDelete,
		openCreate,
		handleOpenCreate,
		handleCloseCreate,
		registerCreate,
		handleSubmitCreate,
		onSubmitCreate,
		errorsCreate,
		isSubmittingCreate,
		openEdit,
		handleOpenEdit,
		handleCloseEdit,
		registerEdit,
		handleSubmitEdit,
		onSubmitEdit,
		errorsEdit,
		isSubmittingEdit,
	}
}
