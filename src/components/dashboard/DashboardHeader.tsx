'use client'

import { Box, Button, Typography } from '@mui/material'

interface DashboardHeaderProps {
	userEmail: string | null | undefined
	onLogout: () => void
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	userEmail,
	onLogout,
}) => {
	return (
		<>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 4,
				}}
			>
				<Typography component='h1' variant='h4'>
					Dashboard
				</Typography>
				<Button variant='contained' color='error' onClick={onLogout}>
					Sign Out
				</Button>
			</Box>
			<Typography variant='h6' sx={{ mb: 2, alignSelf: 'flex-start' }}>
				Welcome, {userEmail}!
			</Typography>
		</>
	)
}
