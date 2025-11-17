import { FieldValues } from 'react-hook-form'

export interface TodoList {
	id: string
	name: string
	ownerId: string
	roles: Record<string, 'admin' | 'viewer'>
}

export interface CreateListFormData extends FieldValues {
	listName: string
}

export interface EditListFormData extends FieldValues {
	editListName: string
}
