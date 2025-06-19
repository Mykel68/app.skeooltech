import { Suspense } from 'react';
import RegistrationPage from './Register';

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<RegistrationPage />
		</Suspense>
	);
}
