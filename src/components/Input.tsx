import type { InputHTMLAttributes } from 'react';

import { useId } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
	/** Keeps the label for assistive tech while hiding it visually. */
	hideLabel?: boolean;
	label: string;
}

export default function Input({
	className,
	hideLabel = false,
	label,
	type = 'text',
	...rest
}: Props) {
	const id = useId();

	return (
		<div className="flex w-full flex-col gap-2">
			<label
				className={
					hideLabel ? 'sr-only' : 'text-body text-ink-strong font-medium'
				}
				htmlFor={id}
			>
				{label}
			</label>
			<input
				{...rest}
				className={[
					'text-body border-line bg-surface text-ink placeholder:text-ink-muted focus:border-focus focus:ring-focus/25 w-full rounded-xl border px-4 py-2 transition-colors focus:ring-3 focus:outline-none',
					className,
				]
					.filter(Boolean)
					.join(' ')}
				id={id}
				type={type}
			/>
		</div>
	);
}
