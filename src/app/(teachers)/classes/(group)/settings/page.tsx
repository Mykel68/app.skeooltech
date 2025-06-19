import { Suspense } from 'react';
import AssessmentSettings from './Settings';

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AssessmentSettings />
		</Suspense>
	);
}
