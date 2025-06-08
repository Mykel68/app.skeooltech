'use client';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
	Eye,
	EyeOff,
	Lock,
	Shield,
	CheckCircle2,
	AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

type FormData = {
	password: string;
	confirmPassword: string;
};

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>();

	const password = watch('password', '');
	const confirmPassword = watch('confirmPassword', '');

	// Password strength indicator
	const getPasswordStrength = (pwd: string) => {
		if (!pwd) return { strength: 0, label: '', color: '' };

		let score = 0;
		if (pwd.length >= 8) score++;
		if (/[A-Z]/.test(pwd)) score++;
		if (/[a-z]/.test(pwd)) score++;
		if (/[0-9]/.test(pwd)) score++;
		if (/[^A-Za-z0-9]/.test(pwd)) score++;

		if (score <= 2)
			return { strength: score, label: 'Weak', color: 'bg-red-500' };
		if (score <= 3)
			return { strength: score, label: 'Fair', color: 'bg-yellow-500' };
		if (score <= 4)
			return { strength: score, label: 'Good', color: 'bg-blue-500' };
		return { strength: score, label: 'Strong', color: 'bg-green-500' };
	};

	const passwordStrength = getPasswordStrength(password);
	const passwordsMatch =
		password && confirmPassword && password === confirmPassword;

	const onSubmit = async ({ password }: FormData) => {
		try {
			await axios.post('/api/auth/reset-password', {
				token,
				newPassword: password,
			});
			toast.success('Your password has been reset successfully!');
			router.push('/login');
		} catch (err: any) {
			toast.error(
				err.response?.data?.message ||
					'Password reset failed. Please try again.'
			);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4'>
			{/* Background decoration */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-600/20 blur-3xl'></div>
				<div className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 blur-3xl'></div>
			</div>

			<Card className='w-full max-w-md relative backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/10'>
				<CardHeader className='text-center pb-2'>
					<div className='mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg'>
						<Shield className='w-8 h-8 text-white' />
					</div>
					<CardTitle className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent'>
						Reset Your Password
					</CardTitle>
					<p className='text-sm text-gray-600 mt-2'>
						Create a strong, secure password for your account
					</p>
				</CardHeader>

				<CardContent className='space-y-6 pt-4'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						{/* New Password Field */}
						<div className='space-y-2'>
							<Label
								htmlFor='password'
								className='text-sm font-medium text-gray-700 flex items-center gap-2'
							>
								<Lock className='w-4 h-4' />
								New Password
							</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Enter your new password'
									className='pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200'
									{...register('password', {
										required: 'Password is required',
										minLength: {
											value: 8,
											message:
												'Password must be at least 8 characters',
										},
									})}
								/>
								<button
									type='button'
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								>
									{showPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>

							{/* Password Strength Indicator */}
							{password && (
								<div className='space-y-2'>
									<div className='flex items-center justify-between text-xs'>
										<span className='text-gray-600'>
											Password strength
										</span>
										<span
											className={`font-medium ${
												passwordStrength.strength >= 4
													? 'text-green-600'
													: passwordStrength.strength >=
													  3
													? 'text-blue-600'
													: passwordStrength.strength >=
													  2
													? 'text-yellow-600'
													: 'text-red-600'
											}`}
										>
											{passwordStrength.label}
										</span>
									</div>
									<div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
										<div
											className={`h-full transition-all duration-300 ${passwordStrength.color}`}
											style={{
												width: `${
													(passwordStrength.strength /
														5) *
													100
												}%`,
											}}
										/>
									</div>
								</div>
							)}

							{errors.password && (
								<div className='flex items-center gap-2 text-red-600 text-xs'>
									<AlertCircle className='w-3 h-3' />
									{errors.password.message}
								</div>
							)}
						</div>

						{/* Confirm Password Field */}
						<div className='space-y-2'>
							<Label
								htmlFor='confirmPassword'
								className='text-sm font-medium text-gray-700 flex items-center gap-2'
							>
								<Lock className='w-4 h-4' />
								Confirm Password
							</Label>
							<div className='relative'>
								<Input
									id='confirmPassword'
									type={
										showConfirmPassword
											? 'text'
											: 'password'
									}
									placeholder='Confirm your new password'
									className='pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200'
									{...register('confirmPassword', {
										required:
											'Please confirm your password',
										validate: (value) =>
											value === password ||
											'Passwords do not match',
									})}
								/>
								<button
									type='button'
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword
										)
									}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								>
									{showConfirmPassword ? (
										<EyeOff className='w-4 h-4' />
									) : (
										<Eye className='w-4 h-4' />
									)}
								</button>
							</div>

							{/* Password Match Indicator */}
							{confirmPassword && (
								<div
									className={`flex items-center gap-2 text-xs ${
										passwordsMatch
											? 'text-green-600'
											: 'text-red-600'
									}`}
								>
									{passwordsMatch ? (
										<>
											<CheckCircle2 className='w-3 h-3' />
											Passwords match
										</>
									) : (
										<>
											<AlertCircle className='w-3 h-3' />
											Passwords do not match
										</>
									)}
								</div>
							)}

							{errors.confirmPassword && (
								<div className='flex items-center gap-2 text-red-600 text-xs'>
									<AlertCircle className='w-3 h-3' />
									{errors.confirmPassword.message}
								</div>
							)}
						</div>

						{/* Submit Button */}
						<Button
							type='submit'
							className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={
								isSubmitting ||
								!passwordsMatch ||
								passwordStrength.strength < 2
							}
						>
							{isSubmitting ? (
								<div className='flex items-center gap-2'>
									<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
									Resetting Password...
								</div>
							) : (
								<div className='flex items-center gap-2'>
									<Shield className='w-4 h-4' />
									Reset Password
								</div>
							)}
						</Button>
					</form>

					{/* Security Tips */}
					<div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
						<h4 className='text-sm font-medium text-blue-900 mb-2'>
							Password Tips:
						</h4>
						<ul className='text-xs text-blue-700 space-y-1'>
							<li>• Use at least 8 characters</li>
							<li>• Include uppercase and lowercase letters</li>
							<li>• Add numbers and special characters</li>
							<li>
								• Avoid common words or personal information
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
