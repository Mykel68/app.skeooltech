'use client';

import { motion } from 'framer-motion';
import { ForgotPasswordForm } from './forgotPassword';

export default function ForgotPasswordPage() {
	return (
		<div className='container relative z-20 max-w-md px-4 mx-auto'>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl space-y-6'
			>
				{/* Logo placeholder */}
				<div className='flex justify-center'>
					<div className='w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center'>
						<span className='text-xl font-bold text-white'>S</span>
					</div>
				</div>

				<div className='space-y-1 text-center'>
					<motion.h1
						className='text-2xl font-bold'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						Forgot Password
					</motion.h1>
					<motion.p
						className='text-muted-foreground text-sm'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						Enter your email address to receive a reset link.
					</motion.p>
				</div>

				<ForgotPasswordForm />

				<div className='pt-4 text-center text-xs text-muted-foreground'>
					<p>
						Remember your password?{' '}
						<a
							href='/login'
							className='underline'
						>
							Log in
						</a>
					</p>
				</div>
			</motion.div>
		</div>
	);
}
