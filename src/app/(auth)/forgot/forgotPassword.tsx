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
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordData>({
		resolver: zodResolver(formSchema),
	});

	const sendPasswordResetEmail = async (email: string) => {
		const res = await axios.post('/api/auth/forgot-password', { email });
		return res.data;
	};

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: ForgotPasswordData) => {
			return sendPasswordResetEmail(data.email);
		},
		onSuccess: () => {
			toast.success('Password reset email sent!');
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				'Something went wrong. Please try again.';
			toast.error(message);
		},
	});

	const onSubmit = (data: ForgotPasswordData) => {
		mutate(data, {
			onSuccess: () => {
				router.push(`/check-mail?email=${data.email}`);
			},
		});
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
				disabled={isPending}
				className='w-full group'
			>
				{isPending ? (
					<Loader2 className='mr-2 h-4 w-4 animate-spin' />
				) : (
					<Mail className='mr-2 h-4 w-4 group-hover:scale-110 transition-transform' />
				)}
				Send Reset Link
			</Button>
		</motion.form>
	);
}
