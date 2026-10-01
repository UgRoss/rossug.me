import { useMemo, useState } from 'react';
import { matchSorter } from 'match-sorter';
import type { NoteSummary } from '../utils/notes';
import { formatRelativeDate } from '../utils/date';
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
			keys: ['title', (note) => note.excerpt ?? ''],
		});
	}, [notes, query, activeCategory]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const visible = filtered.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

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

			<div className="note-list border-line flex w-full flex-col items-start border-t">
				{notes.length === 0 ? (
					<p className="text-body text-ink-muted m-0 py-4">No notes yet.</p>
				) : visible.length === 0 ? (
					<p className="text-body text-ink-muted m-0 py-4">
						No matching notes.
					</p>
				) : (
					visible.map((note) => (
						<article
							key={note.slug}
							className="note-item group border-line relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border-b py-3"
						>
							<h2 className="text-body m-0 flex min-w-0 items-center gap-2 font-normal">
								<a
									href={`/notes/${note.slug}/`}
									className="note-item-title text-ink-strong min-w-0 truncate underline-offset-2 after:absolute after:inset-0 after:content-[''] group-hover:underline group-focus-within:underline"
								>
									{note.title}
								</a>
								<span className="text-meta text-ink-muted">
									#{note.category}
								</span>
							</h2>
							<p className="text-meta text-ink-muted m-0 flex items-center gap-1.5 whitespace-nowrap">
								<span
									aria-hidden="true"
									className="-translate-x-1 opacity-0 transition duration-200 ease-out group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
								>
									→
								</span>
								<time dateTime={note.pubDate}>
									{formatRelativeDate(note.pubDate)}
								</time>
							</p>
						</article>
					))
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
