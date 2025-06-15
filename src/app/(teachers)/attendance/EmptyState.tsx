import { UserCheck } from 'lucide-react';
import React from 'react';

export default function EmptyState() {
	return (
		<div className='min-h-screen px-10 '>
			<div className=' mx-auto'>
				<div className='bg-white rounded-lg shadow-sm border p-12 text-center'>
					<UserCheck className='w-20 h-20 text-gray-400 mx-auto mb-6' />
					<h2 className='text-2xl font-semibold text-gray-900 mb-3'>
						No Class Assigned
					</h2>
					<p className='text-gray-600 mb-2'>
						You are not currently assigned as a class teacher for
						any class.
					</p>
					<p className='text-sm text-gray-500 mb-6'>
						Contact your administrator if you believe this is an
						error.
					</p>
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto'>
						<h3 className='font-medium text-blue-900 mb-2'>
							What you can do:
						</h3>
						<ul className='text-sm text-blue-800 space-y-1'>
							<li>• Check with school administration</li>
							<li>• Verify your teacher profile is complete</li>
							<li>• Contact IT support if the issue persists</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
