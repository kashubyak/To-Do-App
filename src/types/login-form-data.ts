import { FieldValues } from 'react-hook-form'

export interface LoginFormData extends FieldValues {
	email: string
	password: string
}
