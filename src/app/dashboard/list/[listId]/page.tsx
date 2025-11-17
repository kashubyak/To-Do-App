'use client'

import { CreateTaskForm } from '@/components/list/CreateTaskForm'
import { EditTaskModal } from '@/components/list/EditTaskModal'
import { ListPageHeader } from '@/components/list/ListPageHeader'
import { MemberManager } from '@/components/list/MemberManagerProps'
import { TaskList } from '@/components/list/TaskList'
import { useListPage } from '@/hooks/useListPage'
import { Box, CircularProgress, Container } from '@mui/material'

export default function ListPage() {
	const {
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
		formCreateTask,
		onSubmitTaskCreate,
		formAddMember,
		onAddMember,
		formEditTask,
		onSubmitTaskEdit,
		openEditTask,
		handleCloseEditTask,
	} = useListPage()

	if (isLoading || !listDetails || !userRole) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Container component='main' maxWidth='md'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<ListPageHeader listName={listDetails.name} />

				{userRole === Roles.ADMIN && (
					<MemberManager
						listDetails={listDetails}
						currentUserEmail={safeEmail || ''}
						memberError={memberError}
						onRemove={handleRemoveMember}
						form={{
							isSubmitting: formAddMember.formState.isSubmitting,
							register: formAddMember.register,
							handleSubmit: formAddMember.handleSubmit,
							control: formAddMember.control,
							errors: formAddMember.formState.errors,
							onSubmit: onAddMember,
						}}
					/>
				)}

				{userRole === Roles.ADMIN && (
					<CreateTaskForm
						form={{
							isSubmitting: formCreateTask.formState.isSubmitting,
							register: formCreateTask.register,
							handleSubmit: formCreateTask.handleSubmit,
							errors: formCreateTask.formState.errors,
							onSubmit: onSubmitTaskCreate,
						}}
					/>
				)}

				<TaskList
					tasks={tasks}
					userRole={userRole}
					onToggle={handleToggleTask}
					onDelete={handleDeleteTask}
					onOpenEdit={handleOpenEditTask}
				/>
			</Box>

			<EditTaskModal
				open={openEditTask}
				onClose={handleCloseEditTask}
				form={{
					isSubmitting: formEditTask.formState.isSubmitting,
					register: formEditTask.register,
					handleSubmit: formEditTask.handleSubmit,
					errors: formEditTask.formState.errors,
					onSubmit: onSubmitTaskEdit,
				}}
			/>
		</Container>
	)
}
