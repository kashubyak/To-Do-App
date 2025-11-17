import { db } from '@/lib/firebase'
import { TodoList } from '@/types/todo.types'
import { decodeEmail } from '@/utils/email.utils'
import {
	collection,
	deleteField,
	doc,
	getDocs,
	onSnapshot,
	query,
	Unsubscribe,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore'

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
	role: 'admin' | 'viewer',
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
