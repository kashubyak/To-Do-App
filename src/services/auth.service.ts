import { auth, db } from '@/lib/firebase'
import { UserProfile } from '@/types/auth.types'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	User,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export const registerUser = async (
	name: string,
	email: string,
	password: string,
): Promise<User> => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password)
	const user = userCredential.user

	const userProfile: UserProfile = {
		uid: user.uid,
		name: name,
		email: email,
	}
	await setDoc(doc(db, 'users', user.uid), userProfile)
	return user
}

export const loginUser = async (email: string, password: string): Promise<User> => {
	const userCredential = await signInWithEmailAndPassword(auth, email, password)
	return userCredential.user
}

export const logoutUser = async (): Promise<void> => {
	await signOut(auth)
}
