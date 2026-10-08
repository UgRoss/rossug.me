import { useEffect, useMemo, useRef, useState } from 'react';

import type { NoteSummary } from '@/types';

import { formatRelativeDate } from '@/utils/date';
import { describeResults, filterNotes } from '@/utils/filter-notes';
import { noteHref } from '@/utils/routes';
import { attachSlideHighlight } from '@/utils/slide-highlight';

import ArrowIcon from './ArrowIcon';
import Button from './Button';
import Input from './Input';

const PAGE_SIZE = 10;

interface Props {
	notes: NoteSummary[];
}

export default function NoteBrowser({ notes }: Props) {
	const [query, setQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState<null | string>(null);
	const [page, setPage] = useState(1);

	const categories = useMemo(
		() => Array.from(new Set(notes.map((note) => note.category))).sort(),
		[notes],
	);

	const filtered = useMemo(
		() => filterNotes(notes, { category: activeCategory, query }),
		[notes, query, activeCategory],
	);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const visible = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const listRef = useRef<HTMLDivElement>(null);

	// Re-attach whenever the visible rows change so the highlight is hidden
	// rather than left over a row that no longer exists.
	useEffect(() => {
		if (!listRef.current) return;
		return attachSlideHighlight(listRef.current);
	}, [visible]);

	function selectCategory(category: null | string) {
		setActiveCategory(category);
		setPage(1);
	}

	function updateQuery(value: string) {
		setQuery(value);
		setPage(1);
	}

	return (
		<div className="flex w-full flex-col items-start gap-10">
			<div className="flex w-full flex-col items-start gap-3">
				<Input
					hideLabel
					label="Search notes"
					onChange={(event) => updateQuery(event.target.value)}
					placeholder="Search notes…"
					value={query}
				/>
				{categories.length > 0 && (
					<div
						aria-label="Filter by category"
						className="text-body flex flex-wrap items-baseline gap-x-4 gap-y-1.5"
						role="group"
					>
						<span className="text-ink-muted">Filter:</span>
						<CategoryFilter
							active={activeCategory === null}
							label="All"
							onClick={() => selectCategory(null)}
						/>
						{categories.map((category) => (
							<CategoryFilter
								active={activeCategory === category}
								key={category}
								label={category}
								onClick={() =>
									selectCategory(activeCategory === category ? null : category)
								}
							/>
						))}
					</div>
				)}
			</div>

			{notes.length > 0 && (
				<p className="sr-only" role="status">
					{describeResults(filtered.length)}
				</p>
			)}

			<div className="link-list" ref={listRef}>
				{notes.length === 0 ? (
					<p className="text-body text-ink-muted m-0 px-3 py-4">
						No notes yet.
					</p>
				) : visible.length === 0 ? (
					<p className="text-body text-ink-muted m-0 px-3 py-4">
						No matching notes.
					</p>
				) : (
					<>
						<div aria-hidden="true" className="link-highlight" />
						{visible.map((note) => (
							<a
								className="link-row"
								href={noteHref(note.slug)}
								key={note.slug}
							>
								<span className="text-body flex min-w-0 items-baseline gap-2">
									<span className="min-w-0 truncate font-medium">
										{note.title}
									</span>
									<span className="text-meta text-ink-muted hidden shrink-0 sm:inline">
										#{note.category}
									</span>
								</span>
								<time
									className="text-meta text-ink-muted shrink-0 whitespace-nowrap"
									dateTime={note.pubDate}
								>
									{formatRelativeDate(note.pubDate)}
								</time>
							</a>
						))}
					</>
				)}
			</div>

			{pageCount > 1 && (
				<nav
					aria-label="Notes pagination"
					className="text-body flex w-full items-center justify-between"
				>
					<div>
						{currentPage > 1 && (
							<Button
								icon={<ArrowIcon direction="left" />}
								onClick={() => setPage(currentPage - 1)}
							>
								Newer notes
							</Button>
						)}
					</div>
					<div>
						{currentPage < pageCount && (
							<Button
								icon={<ArrowIcon direction="right" />}
								iconPosition="after"
								onClick={() => setPage(currentPage + 1)}
							>
								Older notes
							</Button>
						)}
					</div>
				</nav>
			)}
		</div>
	);
}

function CategoryFilter({
	active,
	label,
	onClick,
}: {
	active: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			aria-pressed={active}
			className={
				active
					? 'text-body text-ink-strong cursor-pointer'
					: 'text-body text-ink-muted hover:text-ink-strong cursor-pointer transition-colors'
			}
			onClick={onClick}
			type="button"
		>
			{label}
		</button>
	);
}
