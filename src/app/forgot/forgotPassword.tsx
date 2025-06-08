'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (data: ForgotPasswordData) => {
		try {
			// Replace with your actual forgot password API call
			console.log('Sending reset email to:', data.email);

			// Fake delay for UX effect
			await new Promise((res) => setTimeout(res, 1500));

			toast.success('Password reset email sent!');
		} catch (error) {
			toast.error('Something went wrong. Please try again.');
		}
	};

	return (
		<motion.form
			onSubmit={handleSubmit(onSubmit)}
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='space-y-4'
		>
			<div className='space-y-2'>
				<Label htmlFor='email'>Email</Label>
				<Input
					type='email'
					id='email'
					placeholder='you@example.com'
					{...register('email')}
					className={
						errors.email
							? 'border-red-500 focus-visible:ring-red-500'
							: ''
					}
				/>
				{errors.email && (
					<p className='text-sm text-red-500 mt-1'>
						{errors.email.message}
					</p>
				)}
			</div>

			<Button
				type='submit'
				disabled={isSubmitting}
				className='w-full group'
			>
				{isSubmitting ? (
					<Loader2 className='mr-2 h-4 w-4 animate-spin' />
				) : (
					<Mail className='mr-2 h-4 w-4 group-hover:scale-110 transition-transform' />
				)}
				Send Reset Link
			</Button>
		</motion.form>
	);
}
