import { useEffect, useMemo, useRef, useState } from 'react';
import { matchSorter } from 'match-sorter';
import type { NoteSummary } from '@/types';
import { formatRelativeDate } from '@/utils/date';
import { noteHref } from '@/utils/routes';
import { attachSlideHighlight } from '@/utils/slide-highlight';
import Button from './Button';

const PAGE_SIZE = 10;

interface Props {
	notes: NoteSummary[];
}

export default function NoteBrowser({ notes }: Props) {
	const [query, setQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const [page, setPage] = useState(1);

	const categories = useMemo(
		() => Array.from(new Set(notes.map((note) => note.category))).sort(),
		[notes],
	);

	const filtered = useMemo(() => {
		const byCategory = activeCategory
			? notes.filter((note) => note.category === activeCategory)
			: notes;

		const trimmedQuery = query.trim();
		if (!trimmedQuery) return byCategory;

		return matchSorter(byCategory, trimmedQuery, {
			keys: ['title', (note) => note.description ?? ''],
		});
	}, [notes, query, activeCategory]);

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

	function selectCategory(category: string | null) {
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
				<div className="w-full">
					<label htmlFor="note-search" className="sr-only">
						Search notes
					</label>
					<input
						id="note-search"
						type="text"
						value={query}
						onChange={(event) => updateQuery(event.target.value)}
						placeholder="Search notes…"
						className="text-body border-line bg-surface text-ink placeholder:text-ink-muted focus:border-ink-strong w-full rounded-md border px-3 py-2 focus:outline-none"
					/>
				</div>
				{categories.length > 0 && (
					<div
						role="group"
						aria-label="Filter by category"
						className="text-body flex flex-wrap items-baseline gap-x-4 gap-y-1.5"
					>
						<span className="text-ink-muted">Filter:</span>
						<CategoryFilter
							label="All"
							active={activeCategory === null}
							onClick={() => selectCategory(null)}
						/>
						{categories.map((category) => (
							<CategoryFilter
								key={category}
								label={category}
								active={activeCategory === category}
								onClick={() =>
									selectCategory(activeCategory === category ? null : category)
								}
							/>
						))}
					</div>
				)}
			</div>

			<div ref={listRef} className="link-list">
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
								key={note.slug}
								href={noteHref(note.slug)}
								className="link-row"
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
									dateTime={note.pubDate}
									className="text-meta text-ink-muted shrink-0 whitespace-nowrap"
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
							<Button icon="←" onClick={() => setPage(currentPage - 1)}>
								Newer notes
							</Button>
						)}
					</div>
					<div>
						{currentPage < pageCount && (
							<Button
								icon="→"
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
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			className={
				active
					? 'text-body text-ink-strong cursor-pointer'
					: 'text-body text-ink-muted hover:text-ink-strong cursor-pointer transition-colors'
			}
		>
			{label}
		</button>
	);
}
