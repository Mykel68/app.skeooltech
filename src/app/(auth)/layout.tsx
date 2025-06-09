'use client';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className='relative min-h-screen flex items-center justify-center overflow-hidden'>
			{/* Video background */}
			<video
				autoPlay
				muted
				loop
				playsInline
				className='absolute top-0 left-0 w-full h-full object-cover'
			>
				<source
					src='/videos/background.mp4'
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video>

			{/* Gradient overlay */}
			<div className='absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-primary/30 z-10' />
			{children}
		</main>
	);
}
