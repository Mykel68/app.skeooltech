import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bell, Search, Settings } from 'lucide-react';

export default function Header() {
	const [currentTime] = useState(
		new Date().toLocaleString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	);
	return (
		<header '>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center py-4'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>
							Teacher Dashboard
						</h1>
						<p className='text-sm text-gray-600'>{currentTime}</p>
					</div>
					<div className='flex items-center gap-4'>
						<Button
							variant='outline'
							size='sm'
						>
							<Search className='h-4 w-4 mr-2' />
							Search
						</Button>
						<Button
							variant='outline'
							size='sm'
							className='relative'
						>
							<Bell className='h-4 w-4' />
							{/* {unreadNotifications > 0 && (
								<span className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
									{unreadNotifications}
								</span>
							)} */}
						</Button>
						<Button
							variant='outline'
							size='sm'
						>
							<Settings className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
