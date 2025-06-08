'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search, Settings } from 'lucide-react';

export function SiteHeader() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval); // cleanup
	}, []);

	const formattedDate = currentTime.toLocaleString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

	return (
		<header className='flex h-[--header-height] items-center border-b py-4 transition-all ease-linear px-4 sm:px-6 lg:px-8'>
			<SidebarTrigger className='-ml-1' />
			<Separator
				orientation='vertical'
				className='mx-4 h-6'
			/>

			<div className='flex justify-between items-center w-full'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						Today&apos;s Date
					</h1>
					<p className='text-sm text-gray-600'>{formattedDate}</p>
				</div>

				<div className='flex items-center gap-3'>
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
						{/* Notification badge example
						<span className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
							3
						</span>
						*/}
					</Button>

					<Button
						variant='outline'
						size='sm'
					>
						<Settings className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</header>
	);
}
