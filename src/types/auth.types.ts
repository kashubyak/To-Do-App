import { FieldValues } from 'react-hook-form'

export interface RegisterFormData extends FieldValues {
	name: string
	email: string
	password: string
	confirmPassword: string
}

export interface UserProfile {
	uid: string
	name: string
	email: string
}
