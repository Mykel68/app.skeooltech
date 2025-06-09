'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Mail,
	ArrowLeft,
	RefreshCw,
	CheckCircle2,
	Clock,
	Shield,
} from 'lucide-react';

export default function CheckEmailPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email') || 'your email';
	const [timeLeft, setTimeLeft] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [isResending, setIsResending] = useState(false);

	// Countdown timer for resend button
	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [timeLeft]);

	const handleResendEmail = async () => {
		setIsResending(true);
		try {
			// Simulate API call to resend email
			await new Promise((resolve) => setTimeout(resolve, 2000));
			setTimeLeft(60);
			setCanResend(false);
		} catch (error) {
			console.error('Failed to resend email');
		} finally {
			setIsResending(false);
		}
	};

	const handleBackToLogin = () => {
		router.push('/login');
	};

	return (
		<Card className='w-full max-w-xl relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/10 z-20'>
			<CardHeader className='text-center '>
				{/* Animated Mail Icon */}
				<div className='mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg relative'>
					<Mail className='w-10 h-10 text-white' />
					<div className='absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
						<CheckCircle2 className='w-4 h-4 text-white' />
					</div>
				</div>

				<CardTitle className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent '>
					Check Your Email
				</CardTitle>

				<p className='text-gray-600 text-sm leading-relaxed text-balance'>
					We've sent a password reset link to{' '}
					<span className='font-semibold'>{email}</span>
				</p>
			</CardHeader>

			<CardContent className='space-y-4'>
				{/* Instructions */}
				<div className='space-y-4'>
					<div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
								<span className='text-white text-xs font-bold'>
									1
								</span>
							</div>
							<div>
								<p className='text-sm font-medium text-blue-900'>
									Check your inbox
								</p>
								<p className='text-xs text-blue-700 mt-1'>
									Look for an email from us with the subject
									"Reset Your Password"
								</p>
							</div>
						</div>
					</div>

					<div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
								<span className='text-white text-xs font-bold'>
									2
								</span>
							</div>
							<div>
								<p className='text-sm font-medium text-blue-900'>
									Click the reset link
								</p>
								<p className='text-xs text-blue-700 mt-1'>
									The link will take you to a secure page to
									create your new password
								</p>
							</div>
						</div>
					</div>

					<div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
						<div className='flex items-start gap-3'>
							<div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
								<span className='text-white text-xs font-bold'>
									3
								</span>
							</div>
							<div>
								<p className='text-sm font-medium text-blue-900'>
									Create new password
								</p>
								<p className='text-xs text-blue-700 mt-1'>
									Choose a strong, unique password for your
									account
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Important Notice */}
				<div className='bg-amber-50 rounded-lg p-4 border border-amber-200'>
					<div className='flex items-start gap-3'>
						<Clock className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-sm font-medium text-amber-900'>
								Link expires in 15 minutes
							</p>
							<p className='text-xs text-amber-700 mt-1'>
								For security reasons, the reset link will expire
								soon. If it expires, you'll need to request a
								new one.
							</p>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className='space-y-3'>
					{/* Resend Email Button */}
					<Button
						onClick={handleResendEmail}
						disabled={!canResend || isResending}
						variant='outline'
						className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50'
					>
						{isResending ? (
							<div className='flex items-center gap-2'>
								<RefreshCw className='w-4 h-4 animate-spin' />
								Sending...
							</div>
						) : !canResend ? (
							<div className='flex items-center gap-2'>
								<RefreshCw className='w-4 h-4' />
								Resend in {timeLeft}s
							</div>
						) : (
							<div className='flex items-center gap-2'>
								<RefreshCw className='w-4 h-4' />
								Resend Email
							</div>
						)}
					</Button>

					{/* Back to Login Button */}
					<Button
						onClick={handleBackToLogin}
						variant='ghost'
						className='w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50'
					>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Back to Login
					</Button>
				</div>

				{/* Help Text */}
				<div className='text-center space-y-2'>
					<p className='text-xs text-gray-500'>
						Didn't receive the email? Check your spam folder or try
						a different email address.
					</p>
					<div className='flex items-center justify-center gap-1 text-xs text-gray-400'>
						<Shield className='w-3 h-3' />
						<span>This link is secure and encrypted</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
