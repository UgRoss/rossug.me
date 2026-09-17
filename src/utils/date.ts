import {
	differenceInYears,
	format,
	formatDistanceToNowStrict,
	parseISO,
} from 'date-fns';

export type DateValue = Date | string;

const toDate = (value: DateValue): Date =>
	typeof value === 'string' ? parseISO(value) : value;

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
