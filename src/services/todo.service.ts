import { db } from '@/lib/firebase'
import { TodoList } from '@/types/todo.types'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	FieldPath,
	onSnapshot,
	query,
	Unsubscribe,
	updateDoc,
	where,
} from 'firebase/firestore'

export const getTodoListsListener = (
	safeEmail: string,
	callback: (lists: TodoList[]) => void,
): Unsubscribe => {
	const q = query(
		collection(db, 'todoLists'),
		where(new FieldPath('roles', safeEmail), 'in', ['admin', 'viewer']),
	)

	const unsubscribe = onSnapshot(
		q,
		querySnapshot => {
			const lists: TodoList[] = []
			querySnapshot.forEach(doc => {
				lists.push({ id: doc.id, ...doc.data() } as TodoList)
			})
			callback(lists)
		},
		error => {
			console.error('Error fetching todo lists:', error)
			callback([])
		},
	)
	return unsubscribe
}

export const createTodoList = async (
	name: string,
	userId: string,
	safeEmail: string,
): Promise<void> => {
	await addDoc(collection(db, 'todoLists'), {
		name: name,
		ownerId: userId,
		roles: {
			[safeEmail]: 'admin',
		},
	})
}

export const updateTodoListName = async (
	listId: string,
	newName: string,
): Promise<void> => {
	const listRef = doc(db, 'todoLists', listId)
	await updateDoc(listRef, {
		name: newName,
	})
}

export const deleteTodoList = async (listId: string): Promise<void> => {
	const listRef = doc(db, 'todoLists', listId)
	await deleteDoc(listRef)
}
