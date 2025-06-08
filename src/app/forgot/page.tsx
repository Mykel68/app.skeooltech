'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type FormData = { email: string };

export default function ForgotPasswordPage() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>();

	const onSubmit = async (data: FormData) => {
		try {
			await axios.post('/api/auth/forgot-password', {
				email: data.email,
			});
			toast.success('If that email exists, we’ve sent a reset link.');
			router.push('/');
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Something went wrong');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-background'>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Forgot Password</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Enter your email and we’ll send you a link to reset your
						password.
					</p>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<div>
							<Label htmlFor='email'>Email Address</Label>
							<Input
								id='email'
								type='email'
								placeholder='you@example.com'
								{...register('email', {
									required: 'Email is required',
								})}
							/>
							{errors.email && (
								<p className='mt-1 text-xs text-destructive'>
									{errors.email.message}
								</p>
							)}
						</div>
						<Button
							type='submit'
							className='w-full'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Sending…' : 'Send Reset Link'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
