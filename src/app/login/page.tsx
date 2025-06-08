'use client';

import { LoginForm } from '@/components/LoginForm';
import { useSchoolStore } from '@/store/schoolStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { schoolDetails, setSchoolDetails } = useSchoolStore();

	const schoolCode = useMemo(() => {
		return (
			searchParams.get('school_code') || schoolDetails?.schoolCode || null
		);
	}, [searchParams, schoolDetails?.schoolCode]);

	// Fetch school details if not in store
	const { data: school, isLoading } = useQuery({
		queryKey: ['school', schoolCode],
		queryFn: async () => {
			if (!schoolCode) throw new Error('No school code');
			const { data } = await axios.get(
				`/api/school/get-code/${schoolCode}`
			);

			setSchoolDetails({
				schoolId: data.school_id,
				schoolCode: data.school_code,
				name: data.name,
				schoolImage: data.school_image,
			});
			return data.data;
		},
		enabled: !!schoolCode,
		initialData: schoolDetails,
	});

	useEffect(() => {
		if (!schoolCode) {
			toast.error('School code missing. Redirecting...');
			router.push('/');
		}
	}, [schoolCode, router]);

	if (!schoolCode) {
		return null;
	}

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/80'>
				<div className='flex flex-col items-center gap-4'>
					<Loader2 className='h-8 w-8 animate-spin text-primary' />
					<p className='text-sm text-muted-foreground'>
						Loading school information...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen flex flex-col lg:flex-row'>
			{/* Form Section */}
			<div className='w-full lg:w-[40%] flex flex-col justify-center p-6 lg:p-12 bg-background relative'>
				<div className='max-w-md mx-auto w-full'>
					{/* School Header */}

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className='mb-8'
					>
						<div className='flex items-center gap-3 mb-8'>
							{school?.school_image ? (
								<div className='relative'>
									<img
										src={
											school.school_image ||
											'/placeholder.svg'
										}
										alt={school.name}
										className='h-12 w-12 rounded-full object-cover border-2 border-primary/20'
									/>
									<div className='absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background'></div>
								</div>
							) : (
								<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20'>
									<span className='text-lg font-bold text-primary'>
										{school?.name?.charAt(0) || 'S'}
									</span>
								</div>
							)}
							<div>
								<h2 className='font-bold text-lg text-foreground'>
									{school?.name}
								</h2>
								<p className='text-xs text-muted-foreground'>
									School Portal
								</p>
							</div>
						</div>
						<div className='space-y-2'>
							<h1 className='text-3xl font-bold tracking-tight'>
								Welcome back
							</h1>
							<p className='text-muted-foreground'>
								Sign in to your account to continue
							</p>
						</div>
					</motion.div>

					{/* Login Form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<LoginForm schoolCode={schoolCode} />
					</motion.div>
				</div>
			</div>

			{/* Hero Section */}
			<div className='hidden lg:flex lg:w-[60%] relative overflow-hidden'>
				{/* Background Image */}
				<div className='absolute inset-0'>
					<img
						src='/images/reg-img.jpg'
						alt='Students collaborating'
						className='w-full h-full object-cover'
					/>
					<div className='absolute inset-0 bg-black/60'></div>
				</div>

				{/* Decorative Elements */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
					<div className='absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl'></div>
				</div>

				{/* Content */}
				<div className='relative z-10 flex flex-col justify-end p-16 text-white'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className='space-y-6'
					>
						<div className='space-y-2'>
							<h2 className='text-5xl font-bold leading-tight'>
								Empowering
								<br />
								<span className='text-white/90'>Education</span>
							</h2>
							<p className='text-xl text-white/80 max-w-md'>
								Join thousands of educators and students in
								creating a better learning experience
							</p>
						</div>

						<div className='flex items-center gap-4 pt-4'>
							<div className='flex -space-x-2'>
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className='w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center'
									>
										<span className='text-sm font-medium'>
											{i}
										</span>
									</div>
								))}
							</div>
							<div className='text-sm text-white/70'>
								<p className='font-medium'>
									10,000+ Active Users
								</p>
								<p>Across 500+ Schools</p>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
