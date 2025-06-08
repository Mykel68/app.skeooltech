import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
	'/',
	'/login',
	'/register',
	'/forgot',
	'/reset-password',
	'/check-mail',
];

export function middleware(request: NextRequest) {
	const token = request.cookies.get('s_id')?.value;

	const isPublicPath = PUBLIC_PATHS.some(
		(path) =>
			request.nextUrl.pathname === path ||
			request.nextUrl.pathname.startsWith(`${path}/`)
	);

	if (!isPublicPath && !token) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
