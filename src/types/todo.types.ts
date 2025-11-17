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

export interface Task {
	id: string
	title: string
	description: string
	completed: boolean
}

export type UserRole = 'admin' | 'viewer' | null

export interface CreateTaskFormData extends FieldValues {
	taskTitle: string
	taskDescription: string
}

export interface EditTaskFormData extends FieldValues {
	editTaskTitle: string
	editTaskDescription: string
}

export interface AddMemberFormData extends FieldValues {
	memberEmail: string
	memberRole: 'admin' | 'viewer'
}
