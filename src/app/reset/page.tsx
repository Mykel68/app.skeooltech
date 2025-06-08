'use client';

import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
// import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type FormData = {
	password: string;
	confirmPassword: string;
};

export default function ResetPasswordPage() {
	const { token } = useParams();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>();
	const password = watch('password', '');

	const onSubmit = async ({ password }: FormData) => {
		try {
			await axios.post('/api/auth/reset-password', { token, password });
			toast.success('Your password has been reset!');
			router.push('/login');
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Reset failed');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen '>
			<Card className='w-full max-w-md'>
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<p className='text-sm text-muted-foreground'>
						Please enter your new password below.
					</p>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<div>
							<Label htmlFor='password'>New Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='••••••••'
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 8,
										message: 'At least 8 characters',
									},
								})}
							/>
							{errors.password && (
								<p className='mt-1 text-xs text-destructive'>
									{errors.password.message}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor='confirmPassword'>
								Confirm Password
							</Label>
							<Input
								id='confirmPassword'
								type='password'
								placeholder='••••••••'
								{...register('confirmPassword', {
									required: 'Please confirm your password',
									validate: (value) =>
										value === password ||
										'Passwords do not match',
								})}
							/>
							{errors.confirmPassword && (
								<p className='mt-1 text-xs text-destructive'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
						<Button
							type='submit'
							className='w-full'
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Resetting…' : 'Reset Password'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
