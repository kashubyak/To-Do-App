import { useAuth } from '@/contexts/AuthContext'
import {
	createTask,
	deleteTask,
	getTasksListener,
	toggleTaskCompleted,
	updateTask,
} from '@/services/task.service'
import {
	addListMember,
	getTodoListListener,
	removeListMember,
} from '@/services/todo.service'
import {
	AddMemberFormData,
	CreateTaskFormData,
	EditTaskFormData,
	Task,
	TodoList,
	UserRole,
} from '@/types/todo.types'
import { decodeEmail, encodeEmail } from '@/utils/email.utils'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const useListPage = () => {
	const { user } = useAuth()
	const router = useRouter()
	const params = useParams()
	const listId = params.listId as string

	const [listDetails, setListDetails] = useState<TodoList | null>(null)
	const [tasks, setTasks] = useState<Task[]>([])
	const [userRole, setUserRole] = useState<UserRole>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [memberError, setMemberError] = useState<string | null>(null)
	const [openEditTask, setOpenEditTask] = useState(false)
	const [currentTask, setCurrentTask] = useState<Task | null>(null)

	const safeEmail = useMemo(
		() => (user?.email ? encodeEmail(user.email) : null),
		[user?.email],
	)

	useEffect(() => {
		if (!user || !safeEmail || !listId) return
		const unsubscribe = getTodoListListener(listId, listData => {
			if (listData) {
				setListDetails(listData)
				const role = listData.roles[safeEmail]
				if (role === 'admin' || role === 'viewer') {
					setUserRole(role)
					setIsLoading(false)
				} else {
					setUserRole(null)
					router.replace('/dashboard')
				}
			} else {
				router.replace('/dashboard')
			}
		})
		return () => unsubscribe()
	}, [user, listId, router, safeEmail])

	useEffect(() => {
		if (!listId) return
		const unsubscribe = getTasksListener(listId, tasksData => {
			setTasks(tasksData)
		})
		return () => unsubscribe()
	}, [listId])

	const formCreateTask = useForm<CreateTaskFormData>()
	const formAddMember = useForm<AddMemberFormData>({
		defaultValues: { memberEmail: '', memberRole: 'viewer' },
	})
	const formEditTask = useForm<EditTaskFormData>()

	const onSubmitTaskCreate: SubmitHandler<CreateTaskFormData> = async data => {
		if (userRole !== 'admin') return
		try {
			await createTask(listId, data)
			formCreateTask.reset()
		} catch (error) {
			console.error('Error creating task:', error)
		}
	}

	const handleOpenEditTask = (task: Task) => {
		setCurrentTask(task)
		formEditTask.setValue('editTaskTitle', task.title)
		formEditTask.setValue('editTaskDescription', task.description)
		setOpenEditTask(true)
	}
	const handleCloseEditTask = () => {
		setOpenEditTask(false)
		setCurrentTask(null)
		formEditTask.reset()
	}
	const onSubmitTaskEdit: SubmitHandler<EditTaskFormData> = async data => {
		if (!currentTask || userRole !== 'admin') return
		try {
			await updateTask(listId, currentTask.id, data)
			handleCloseEditTask()
		} catch (error) {
			console.error('Error updating task:', error)
		}
	}

	const handleToggleTask = async (task: Task) => {
		if (!userRole) return
		try {
			await toggleTaskCompleted(listId, task.id, task.completed)
		} catch (error) {
			console.error('Error toggling task:', error)
		}
	}

	const handleDeleteTask = async (taskId: string) => {
		if (userRole !== 'admin') return
		if (window.confirm('Are you sure you want to delete this task?')) {
			try {
				await deleteTask(listId, taskId)
			} catch (error) {
				console.error('Error deleting task:', error)
			}
		}
	}

	const onAddMember: SubmitHandler<AddMemberFormData> = async data => {
		if (userRole !== 'admin' || !listDetails || !user) return
		setMemberError(null)

		const emailToAdd = data.memberEmail
		if (emailToAdd === user.email) {
			setMemberError('You cannot add yourself.')
			return
		}

		const safeEmailToAdd = encodeEmail(emailToAdd)
		if (listDetails.roles[safeEmailToAdd]) {
			setMemberError('This user is already a member.')
			return
		}

		try {
			await addListMember(listId, safeEmailToAdd, data.memberRole)
			formAddMember.reset()
		} catch (error: any) {
			console.error('Error adding member:', error)
			if (error.message === 'User not found.') {
				setMemberError('User with this email not found.')
			} else {
				setMemberError('An error occurred. Please try again.')
			}
		}
	}

	const handleRemoveMember = async (safeEmailToRemove: string) => {
		if (userRole !== 'admin' || !safeEmail || safeEmailToRemove === safeEmail) {
			setMemberError('You cannot remove yourself.')
			return
		}
		if (
			window.confirm(`Are you sure you want to remove ${decodeEmail(safeEmailToRemove)}?`)
		) {
			try {
				await removeListMember(listId, safeEmailToRemove)
			} catch (error) {
				console.error('Error removing member:', error)
			}
		}
	}

	return {
		isLoading,
		listDetails,
		tasks,
		user,
		userRole,
		safeEmail,
		handleToggleTask,
		handleDeleteTask,
		handleOpenEditTask,
		memberError,
		handleRemoveMember,
		// Forms
		formCreateTask,
		onSubmitTaskCreate,
		formAddMember,
		onAddMember,
		formEditTask,
		onSubmitTaskEdit,
		// Edit Modal State
		openEditTask,
		handleCloseEditTask,
	}
}
