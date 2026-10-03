import {
	differenceInYears,
	format,
	formatDistanceToNowStrict,
	parseISO,
} from 'date-fns';

export type DateValue = Date | string;

const toDate = (value: DateValue): Date =>
	typeof value === 'string' ? parseISO(value) : value;

// Content dates are plain calendar days that parse to UTC midnight, so they
// must be formatted in UTC; the build machine's timezone would otherwise show
// the previous day anywhere west of Greenwich.
const dateFormat = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC',
});

/** "Jan 5, 2026" — the absolute date format used in lists and article headers. */
export const formatDate = (value: DateValue): string =>
	dateFormat.format(toDate(value));

/**
 * "3 days ago"-style relative date, falling back to just the year once a
 * date is a year or older — "11 months ago" is useful, "14 months ago"
 * isn't, so past that threshold the year alone reads better.
 */
export function formatRelativeDate(value: DateValue): string {
	const date = toDate(value);
	return differenceInYears(new Date(), date) >= 1
		? format(date, 'yyyy')
		: formatDistanceToNowStrict(date, { addSuffix: true });
}
