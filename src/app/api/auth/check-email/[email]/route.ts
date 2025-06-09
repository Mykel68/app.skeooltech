import { NextResponse } from 'next/server';
import axios from 'axios';
import { backendClient } from '@/lib/backendClient';

// ✅ GET school profile
export async function GET(
	_request: Request,
	context: { params: Promise<{ email: string }> }
) {
	try {
		const { params } = await context;
		const backendUrl = process.env.MAIN_BACKEND_URL;
		if (!backendUrl) {
			throw new Error('MAIN_BACKEND_URL is not set');
		}

		const response = await backendClient.get(
			`${backendUrl}/api/auth/check-email?email=${(await params).email}`
		);
		return NextResponse.json(response.data, { status: 200 });
	} catch (error) {
		if (axios.isAxiosError(error)) {
			return NextResponse.json(
				{
					error:
						error.response?.data?.message ||
						'Failed to fetch school profile',
				},
				{ status: error.response?.status || 500 }
			);
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
