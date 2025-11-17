import { db } from '@/lib/firebase'
import { CreateTaskFormData, EditTaskFormData, Task } from '@/types/todo.types'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	Unsubscribe,
	updateDoc,
} from 'firebase/firestore'

export const getTasksListener = (
	listId: string,
	callback: (tasks: Task[]) => void,
): Unsubscribe => {
	const tasksCollectionRef = collection(db, 'todoLists', listId, 'tasks')
	const q = query(tasksCollectionRef)

	const unsubscribe = onSnapshot(
		q,
		querySnapshot => {
			const tasksData: Task[] = []
			querySnapshot.forEach(doc => {
				tasksData.push({ id: doc.id, ...doc.data() } as Task)
			})
			callback(tasksData)
		},
		error => {
			console.error('Error fetching tasks:', error)
			callback([])
		},
	)
	return unsubscribe
}

export const createTask = async (
	listId: string,
	data: CreateTaskFormData,
): Promise<void> => {
	const tasksCollectionRef = collection(db, 'todoLists', listId, 'tasks')
	await addDoc(tasksCollectionRef, {
		title: data.taskTitle,
		description: data.taskDescription || '',
		completed: false,
	})
}

export const updateTask = async (
	listId: string,
	taskId: string,
	data: EditTaskFormData,
): Promise<void> => {
	const taskRef = doc(db, 'todoLists', listId, 'tasks', taskId)
	await updateDoc(taskRef, {
		title: data.editTaskTitle,
		description: data.editTaskDescription || '',
	})
}

export const toggleTaskCompleted = async (
	listId: string,
	taskId: string,
	completed: boolean,
): Promise<void> => {
	const taskRef = doc(db, 'todoLists', listId, 'tasks', taskId)
	await updateDoc(taskRef, { completed: !completed })
}

export const deleteTask = async (listId: string, taskId: string): Promise<void> => {
	const taskRef = doc(db, 'todoLists', listId, 'tasks', taskId)
	await deleteDoc(taskRef)
}
