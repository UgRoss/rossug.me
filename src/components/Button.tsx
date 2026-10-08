import type { ReactNode } from 'react';

/**
 * Careful with client directives: PostLayout, NoteLayout, 404, and
 * Pagination all render this with no `client:*` directive, so it stays
 * plain static HTML on every blog post, note, and the 404/blog-list pages —
 * zero React shipped to the browser there. Only NoteBrowser needs the
 * onClick branch, and it already hydrates itself with client:load, so
 * Button doesn't need (and shouldn't get) its own directive there either.
 * Adding client:load/client:visible/etc. directly to a Button usage would
 * ship React + ReactDOM on whatever page it's used on.
 */
interface Props {
	children: ReactNode;
	className?: string;
	href?: string;
	icon?: ReactNode;
	iconPosition?: 'after' | 'before';
	onClick?: () => void;
}

export default function Button({
	children,
	className,
	href,
	icon,
	iconPosition = 'before',
	onClick,
}: Props) {
	const classes = [
		'group inline-flex w-fit cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-ink-muted transition-colors duration-[160ms] hover:text-ink-strong focus-visible:text-ink-strong',
		className,
	]
		.filter(Boolean)
		.join(' ');

	const iconBefore = icon && iconPosition === 'before' && (
		<span
			aria-hidden="true"
			className="inline-block transition-transform duration-200 ease-out group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5"
		>
			{icon}
		</span>
	);

	const iconAfter = icon && iconPosition === 'after' && (
		<span
			aria-hidden="true"
			className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
		>
			{icon}
		</span>
	);

	if (href) {
		return (
			<a className={classes} href={href}>
				{iconBefore}
				{children}
				{iconAfter}
			</a>
		);
	}

	return (
		<button className={classes} onClick={onClick} type="button">
			{iconBefore}
			{children}
			{iconAfter}
		</button>
	);
}
