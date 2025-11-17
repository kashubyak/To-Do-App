'use client'

import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'

interface ListPageHeaderProps {
	listName: string
}

export const ListPageHeader: React.FC<ListPageHeaderProps> = ({ listName }) => (
	<>
		<Breadcrumbs aria-label='breadcrumb' sx={{ alignSelf: 'flex-start', mb: 2 }}>
			<Link href='/dashboard'>
				<Typography
					sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
				>
					Dashboard
				</Typography>
			</Link>
			<Typography color='text.primary'>{listName}</Typography>
		</Breadcrumbs>
		<Typography component='h1' variant='h4' sx={{ mb: 4, alignSelf: 'flex-start' }}>
			{listName}
		</Typography>
	</>
)
