/**
 * Hover highlight that slides between rows instead of each row fading its
 * own background, so quick pointer movement reads as one continuous motion.
 *
 * `list` must contain one `.link-highlight` element (absolutely positioned
 * at the list's top-left, full width) and any number of `.link-row`
 * elements. Row geometry is read on every hover, so rows can be added or
 * removed freely. Returns a cleanup function that detaches the listeners
 * and hides the highlight.
 */
export function attachSlideHighlight(list: HTMLElement): () => void {
	const highlight = list.querySelector<HTMLElement>('.link-highlight');
	if (!highlight) return () => {};

	const canHover = window.matchMedia('(hover: hover)');

	const show = (row: HTMLElement) => {
		// First placement should appear in position, not slide in from
		// wherever the highlight was last left.
		const instant = highlight.style.opacity !== '1';
		if (instant) highlight.style.transition = 'none';
		highlight.style.height = `${row.offsetHeight}px`;
		highlight.style.transform = `translateY(${row.offsetTop}px)`;
		if (instant) {
			highlight.getBoundingClientRect();
			highlight.style.transition = '';
		}
		highlight.style.opacity = '1';
	};
	const hide = () => {
		highlight.style.opacity = '0';
	};
	const rowFrom = (target: EventTarget | null) =>
		(target as HTMLElement | null)?.closest<HTMLElement>('.link-row') ?? null;

	const onPointerOver = (event: PointerEvent) => {
		if (!canHover.matches) return;
		const row = rowFrom(event.target);
		if (row) show(row);
	};
	const onFocusIn = (event: FocusEvent) => {
		const row = rowFrom(event.target);
		if (row) show(row);
	};

	list.addEventListener('pointerover', onPointerOver);
	list.addEventListener('pointerleave', hide);
	list.addEventListener('focusin', onFocusIn);
	list.addEventListener('focusout', hide);

	return () => {
		list.removeEventListener('pointerover', onPointerOver);
		list.removeEventListener('pointerleave', hide);
		list.removeEventListener('focusin', onFocusIn);
		list.removeEventListener('focusout', hide);
		hide();
	};
}
