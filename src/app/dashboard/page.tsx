'use client'

import { CreateListModal } from '@/components/dashboard/CreateListModal'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { EditListModal } from '@/components/dashboard/EditListModal'
import { TodoLists } from '@/components/dashboard/TodoList'
import { useDashboard } from '@/hooks/useDashboard'
import { Box, Container } from '@mui/material'

export default function DashboardPage() {
	const {
		user,
		handleLogout,
		todoLists,
		isLoadingLists,
		userIsAdmin,
		handleDelete,
		openCreate,
		handleOpenCreate,
		handleCloseCreate,
		registerCreate,
		handleSubmitCreate,
		onSubmitCreate,
		errorsCreate,
		isSubmittingCreate,
		openEdit,
		handleOpenEdit,
		handleCloseEdit,
		registerEdit,
		handleSubmitEdit,
		onSubmitEdit,
		errorsEdit,
		isSubmittingEdit,
	} = useDashboard()

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
				<DashboardHeader
					userEmail={user?.displayName || user?.email}
					onLogout={handleLogout}
				/>

				<TodoLists
					isLoading={isLoadingLists}
					lists={todoLists}
					onOpenCreate={handleOpenCreate}
					onOpenEdit={handleOpenEdit}
					onDelete={handleDelete}
					userIsAdmin={userIsAdmin}
				/>
			</Box>

			<CreateListModal
				open={openCreate}
				onClose={handleCloseCreate}
				register={registerCreate}
				handleSubmit={handleSubmitCreate}
				onSubmit={onSubmitCreate}
				errors={errorsCreate}
				isSubmitting={isSubmittingCreate}
			/>

			<EditListModal
				open={openEdit}
				onClose={handleCloseEdit}
				register={registerEdit}
				handleSubmit={handleSubmitEdit}
				onSubmit={onSubmitEdit}
				errors={errorsEdit}
				isSubmitting={isSubmittingEdit}
			/>
		</Container>
	)
}
