import { db } from '@/lib/firebase'
import { TodoList, UserRole } from '@/types/todo.types'
import { decodeEmail } from '@/utils/email.utils'
import {
	addDoc,
	collection,
	deleteDoc,
	deleteField,
	doc,
	FieldPath,
	getDocs,
	onSnapshot,
	query,
	Unsubscribe,
	updateDoc,
	where,
	writeBatch,
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

export const getTodoListListener = (
	listId: string,
	callback: (list: TodoList | null) => void,
): Unsubscribe => {
	const listRef = doc(db, 'todoLists', listId)
	const unsubscribe = onSnapshot(
		listRef,
		docSnap => {
			if (docSnap.exists()) {
				callback({ id: docSnap.id, ...docSnap.data() } as TodoList)
			} else {
				console.error('List not found')
				callback(null)
			}
		},
		error => {
			console.error('Error fetching list details:', error)
			callback(null)
		},
	)
	return unsubscribe
}

const findUserByEmail = async (email: string): Promise<boolean> => {
	const usersRef = collection(db, 'users')
	const q = query(usersRef, where('email', '==', email))
	const querySnapshot = await getDocs(q)
	return !querySnapshot.empty
}

export const addListMember = async (
	listId: string,
	safeEmail: string,
	role: UserRole,
): Promise<void> => {
	const userExists = await findUserByEmail(decodeEmail(safeEmail))
	if (!userExists) throw new Error('User with this email not found.')

	const listRef = doc(db, 'todoLists', listId)
	await updateDoc(listRef, {
		[`roles.${safeEmail}`]: role,
	})
}

export const removeListMember = async (
	listId: string,
	safeEmail: string,
): Promise<void> => {
	const listRef = doc(db, 'todoLists', listId)
	const batch = writeBatch(db)
	batch.update(listRef, {
		[`roles.${safeEmail}`]: deleteField(),
	})
	await batch.commit()
}
