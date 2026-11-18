import { ReactNode } from 'react';

const PATHS = {
	check: <path d="M20 6 9 17l-5-5"/>,
	alert: <>
		<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
		<path d="M12 9v4"/>
		<path d="M12 17h.01"/>
	</>,
	info: <>
		<circle cx="12" cy="12" r="10"/>
		<path d="M12 16v-4"/>
		<path d="M12 8h.01"/>
	</>,
	copy: <>
		<rect x="9" y="9" width="13" height="13" rx="2"/>
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
	</>,
	download: <>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
		<path d="m7 10 5 5 5-5"/>
		<path d="M12 15V3"/>
	</>,
	reset: <>
		<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
		<path d="M3 3v5h5"/>
	</>,
	trash: <>
		<path d="M3 6h18"/>
		<path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
		<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
	</>,
	arrowRight: <>
		<path d="M5 12h14"/>
		<path d="m12 5 7 7-7 7"/>
	</>,
	file: <>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
		<path d="M14 2v6h6"/>
	</>,
	shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
	sparkles: <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>,
	server: <>
		<rect x="2" y="2" width="20" height="8" rx="2"/>
		<rect x="2" y="14" width="20" height="8" rx="2"/>
		<path d="M6 6h.01"/>
		<path d="M6 18h.01"/>
	</>,
	keyboard: <>
		<rect x="2" y="5" width="20" height="14" rx="2"/>
		<path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M18 13h.01M8 16h8"/>
	</>,
	x: <>
		<path d="M18 6 6 18"/>
		<path d="m6 6 12 12"/>
	</>,
	ban: <>
		<circle cx="12" cy="12" r="10"/>
		<path d="m4.9 4.9 14.2 14.2"/>
	</>,
	eyeOff: <>
		<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
		<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
		<path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
		<path d="m2 2 20 20"/>
	</>,
	pencil: <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>,
	github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2"/>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

interface Icon {
	name: IconName
	size?: number
	className?: string
}
function Icon({ name, size = 16, className }: Icon) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			{PATHS[name]}
		</svg>
	);
}
export default Icon;
