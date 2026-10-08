interface Props {
	direction: 'left' | 'right';
}

/** Arrow with a short shaft; the font's arrow glyphs have long tails. */
export default function ArrowIcon({ direction }: Props) {
	return (
		<svg
			aria-hidden="true"
			className={direction === 'left' ? '-scale-x-100' : undefined}
			fill="none"
			height="1em"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			viewBox="0 0 16 16"
			width="1em"
		>
			<path d="M4 8h8M8.5 4.5 12 8l-3.5 3.5" />
		</svg>
	);
}
