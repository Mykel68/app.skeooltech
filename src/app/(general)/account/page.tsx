'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	Edit2,
	Save,
	X,
	User,
	Mail,
	Building,
	GraduationCap,
	Shield,
	Bell,
	Eye,
	AlertCircle,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { Input } from '@/components/ui/input';

const UserProfile = () => {
	const { username, firstName, lastName, email, role, schoolName, userId } =
		useUserStore();
	const [isEditing, setIsEditing] = React.useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty, isSubmitting, errors },
	} = useForm({
		defaultValues: {
			username,
			email,
		},
	});

	const updateUserProfile = async (data: {}) => {
		const res = await axios.patch(`/api/user/profile/${userId}`, data);
		return res.data;
	};

	const mutation = useMutation({
		mutationFn: updateUserProfile,
		onSuccess: () => {
			toast.success('Profile updated successfully!');
			setIsEditing(false);
		},
		onError: () => {
			toast.error('Something went wrong. Try again.');
		},
	});

	const onSubmit = (data: {}) => {
		mutation.mutate(data);
	};

	const getInitials = () => {
		return `${firstName?.charAt(0) || ''}${
			lastName?.charAt(0) || ''
		}`.toUpperCase();
	};

	const handleCancel = () => {
		reset();
		setIsEditing(false);
	};

	return (
		<div className='min-h-screen p-4'>
			<div className='max-w-7xl mx-auto'>
				{/* Main Profile Card */}
				<div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden'>
					{/* Enhanced Header */}
					<div className='relative'>
						<div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'></div>
						<div className='absolute inset-0 bg-black/10'></div>
						<div className='relative px-8 py-12'>
							<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
								<div className='flex items-center space-x-6'>
									{/* Enhanced Avatar */}
									<div className='relative'>
										<div className='w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/30 shadow-lg'>
											<span className='text-2xl font-bold text-white'>
												{getInitials()}
											</span>
										</div>
										<div className='absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center'>
											<div className='w-3 h-3 bg-white rounded-full'></div>
										</div>
									</div>
									<div>
										<h1 className='text-3xl font-bold text-white mb-2'>
											{firstName} {lastName}
										</h1>
										<p className='text-blue-100 text-lg mb-1'>
											@{username}
										</p>
										<div className='flex items-center space-x-2'>
											<div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full'>
												<span className='text-white text-sm font-medium capitalize'>
													{role}
												</span>
											</div>
											<div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full'>
												<span className='text-white text-sm'>
													{schoolName}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								{!isEditing ? (
									<button
										type='button'
										onClick={() => setIsEditing(true)}
										className='self-start bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg'
									>
										<Edit2 className='w-5 h-5' />
										<span className='font-medium'>
											Edit Profile
										</span>
									</button>
								) : (
									<div className='flex space-x-3'>
										<button
											type='submit'
											form='profile-form'
											disabled={isSubmitting || !isDirty}
											className='bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100'
										>
											<Save className='w-5 h-5' />
											<span className='font-medium'>
												{isSubmitting
													? 'Saving...'
													: 'Save Changes'}
											</span>
										</button>
										<button
											type='button'
											onClick={handleCancel}
											disabled={isSubmitting}
											className='bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg disabled:hover:scale-100'
										>
											<X className='w-5 h-5' />
											<span className='font-medium'>
												Cancel
											</span>
										</button>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Profile Form */}
					<div className='p-8'>
						<form
							id='profile-form'
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className='grid lg:grid-cols-2 gap-8'>
								{/* Editable Information */}
								<div className='space-y-6'>
									<div className='flex items-center space-x-3 mb-6'>
										<div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
											<Edit2 className='w-4 h-4 text-white' />
										</div>
										<h2 className='text-xl font-bold text-gray-800'>
											Editable Information
										</h2>
									</div>

									{/* Username Field */}
									<div className='group'>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Username
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
												<User
													className={`w-5 h-5 transition-colors ${
														isEditing &&
														!errors.username
															? 'text-blue-500'
															: errors.username
															? 'text-red-500'
															: 'text-gray-400'
													}`}
												/>
											</div>
											<Input
												{...register('username', {
													required:
														'Username is required',
													minLength: {
														value: 3,
														message:
															'Username must be at least 3 characters',
													},
												})}
												disabled={!isEditing}
												className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 font-medium ${
													isEditing
														? errors.username
															? 'bg-white border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
															: 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
														: 'bg-gray-50 border-gray-200 text-gray-900'
												}`}
												placeholder='Enter username'
											/>
										</div>
										{errors.username && (
											<p className='mt-1 text-sm text-red-600 flex items-center space-x-1'>
												<AlertCircle className='w-4 h-4' />
												<span>
													{errors.username.message}
												</span>
											</p>
										)}
									</div>

									{/* Email Field */}
									<div className='group'>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Email Address
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
												<Mail
													className={`w-5 h-5 transition-colors ${
														isEditing &&
														!errors.email
															? 'text-blue-500'
															: errors.email
															? 'text-red-500'
															: 'text-gray-400'
													}`}
												/>
											</div>
											<Input
												{...register('email', {
													required:
														'Email is required',
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message:
															'Invalid email address',
													},
												})}
												disabled={!isEditing}
												type='email'
												className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all duration-200 font-medium ${
													isEditing
														? errors.email
															? 'bg-white border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent'
															: 'bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
														: 'bg-gray-50 border-gray-200 text-gray-900'
												}`}
												placeholder='Enter email address'
											/>
										</div>
										{errors.email && (
											<p className='mt-1 text-sm text-red-600 flex items-center space-x-1'>
												<AlertCircle className='w-4 h-4' />
												<span>
													{errors.email.message}
												</span>
											</p>
										)}
									</div>
								</div>

								{/* Read-Only Information */}
								<div className='space-y-6'>
									<div className='flex items-center space-x-3 mb-6'>
										<div className='w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center'>
											<Shield className='w-4 h-4 text-white' />
										</div>
										<h2 className='text-xl font-bold text-gray-800'>
											Account Information
										</h2>
										<span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
											Read-only
										</span>
									</div>

									{/* First Name */}
									<div className='group'>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											First Name
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
												<User className='w-5 h-5 text-gray-400' />
											</div>
											<div className='w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl font-medium text-gray-600 border-2 border-dashed border-gray-300'>
												{firstName}
											</div>
										</div>
									</div>

									{/* Last Name */}
									<div className='group'>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Last Name
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
												<User className='w-5 h-5 text-gray-400' />
											</div>
											<div className='w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl font-medium text-gray-600 border-2 border-dashed border-gray-300'>
												{lastName}
											</div>
										</div>
									</div>

									{/* Role */}
									{/* <div className='group'>
										<label className='block text-sm font-semibold text-gray-700 mb-2'>
											Role
										</label>
										<div className='relative'>
											<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
												<Building className='w-5 h-5 text-gray-400' />
											</div>
											<div className='w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl font-medium text-gray-600 border-2 border-dashed border-gray-300 capitalize'>
												{role}
											</div>
										</div>
									</div> */}
								</div>
							</div>
						</form>

						{/* School Information Card */}
						<div className='mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100'>
							<div className='flex items-center space-x-3 mb-4'>
								<div className='w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center'>
									<GraduationCap className='w-6 h-6 text-white' />
								</div>
								<div>
									<h3 className='text-lg font-bold text-gray-800'>
										Institution
									</h3>
									<p className='text-indigo-600 font-semibold text-lg'>
										{schoolName}
									</p>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className='mt-8 grid sm:grid-cols-3 gap-4'>
							<button
								type='button'
								className='p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group'
							>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
										<Bell className='w-5 h-5 text-white' />
									</div>
									<div className='text-left'>
										<p className='font-semibold text-gray-800'>
											Notifications
										</p>
										<p className='text-sm text-gray-600'>
											Manage alerts
										</p>
									</div>
								</div>
							</button>

							<button
								type='button'
								className='p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group'
							>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
										<Shield className='w-5 h-5 text-white' />
									</div>
									<div className='text-left'>
										<p className='font-semibold text-gray-800'>
											Privacy
										</p>
										<p className='text-sm text-gray-600'>
											Security settings
										</p>
									</div>
								</div>
							</button>

							<button
								type='button'
								className='p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group'
							>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
										<Eye className='w-5 h-5 text-white' />
									</div>
									<div className='text-left'>
										<p className='font-semibold text-gray-800'>
											Activity
										</p>
										<p className='text-sm text-gray-600'>
											View history
										</p>
									</div>
								</div>
							</button>
						</div>

						{/* Enhanced Info Message */}
						<div className='mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl'>
							<div className='flex items-start space-x-3'>
								<AlertCircle className='w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0' />
								<div>
									<h4 className='font-semibold text-amber-800 mb-2'>
										Important Notice
									</h4>
									<p className='text-amber-700 leading-relaxed'>
										Personal information like your name,
										role, and institution are managed by
										your educational institution. For
										changes to these details, please contact
										your system administrator or IT support
										team.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
