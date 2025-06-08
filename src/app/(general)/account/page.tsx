'use client';

import React, { useState } from 'react';
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
	Check,
	AlertCircle,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const UserProfile = () => {
	// Mock store values - in real app these would come from useUserStore
	const username = useUserStore((s) => s.username);
	const firstName = useUserStore((s) => s.firstName);
	const lastName = useUserStore((s) => s.lastName);
	const role = useUserStore((s) => s.role);
	const email = useUserStore((s) => s.email);

	const [profile, setProfile] = useState({
		username: username,
		email: email,
		first_name: firstName,
		last_name: lastName,
		role: role,
		school_name: 'University of Technology',
		avatar: null,
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editedProfile, setEditedProfile] = useState({ ...profile });
	const [showSuccess, setShowSuccess] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedProfile({ ...profile });
	};

	const handleSave = async () => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		setProfile({
			...profile,
			username: editedProfile.username,
			email: editedProfile.email,
		});
		setIsEditing(false);
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 3000);
	};

	const handleCancel = () => {
		setEditedProfile({ ...profile });
		setIsEditing(false);
	};

	const handleChange = (field, value) => {
		setEditedProfile((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const getInitials = () => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<div className='min-h-screen p-4'>
			{/* Success Toast */}
			{showSuccess && (
				<div className='fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 animate-in slide-in-from-top duration-300'>
					<Check className='w-5 h-5' />
					<span className='font-medium'>
						Profile updated successfully!
					</span>
				</div>
			)}

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
												<span className='text-white text-sm font-medium'>
													{role}
												</span>
											</div>
											<div className='px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full'>
												<span className='text-white text-sm'>
													{profile.school_name}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								{!isEditing ? (
									<button
										onClick={handleEdit}
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
											onClick={handleSave}
											className='bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg'
										>
											<Save className='w-5 h-5' />
											<span className='font-medium'>
												Save Changes
											</span>
										</button>
										<button
											onClick={handleCancel}
											className='bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg'
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

					{/* Profile Content */}
					<div className='p-8'>
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
											<User className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
										</div>
										{isEditing ? (
											<input
												type='text'
												value={editedProfile.username}
												onChange={(e) =>
													handleChange(
														'username',
														e.target.value
													)
												}
												className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium'
												placeholder='Enter username'
											/>
										) : (
											<div className='w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-medium text-gray-900'>
												{profile.username}
											</div>
										)}
									</div>
								</div>

								{/* Email Field */}
								<div className='group'>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Email Address
									</label>
									<div className='relative'>
										<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
											<Mail className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
										</div>
										{isEditing ? (
											<input
												type='email'
												value={editedProfile.email}
												onChange={(e) =>
													handleChange(
														'email',
														e.target.value
													)
												}
												className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium'
												placeholder='Enter email address'
											/>
										) : (
											<div className='w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl font-medium text-gray-900'>
												{profile.email}
											</div>
										)}
									</div>
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
											{profile.first_name}
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
											{profile.last_name}
										</div>
									</div>
								</div>

								{/* Role */}
								<div className='group'>
									<label className='block text-sm font-semibold text-gray-700 mb-2'>
										Role
									</label>
									<div className='relative'>
										<div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
											<Building className='w-5 h-5 text-gray-400' />
										</div>
										<div className='w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl font-medium text-gray-600 border-2 border-dashed border-gray-300'>
											{profile.role}
										</div>
									</div>
								</div>
							</div>
						</div>

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
										{profile.school_name}
									</p>
								</div>
							</div>
						</div>

						{/* Quick Actions */}
						<div className='mt-8 grid sm:grid-cols-3 gap-4'>
							<button className='p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group'>
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

							<button className='p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group'>
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

							<button className='p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group'>
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
