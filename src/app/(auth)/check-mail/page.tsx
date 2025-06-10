import { Suspense } from 'react';
import CheckEmailPage from './CheckMailClient';

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<CheckEmailPage />
		</Suspense>
	);
}
