import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDate, formatRelativeDate } from '../date';

describe('formatDate', () => {
	const originalTz = process.env.TZ;

	afterEach(() => {
		process.env.TZ = originalTz;
	});

	// Content dates like `2026-01-05` parse to UTC midnight, which is still the
	// previous day anywhere west of Greenwich.
	it.each(['America/Los_Angeles', 'UTC', 'Pacific/Auckland'])(
		'shows the UTC calendar day when the machine is in %s',
		(timeZone) => {
			process.env.TZ = timeZone;
			expect(formatDate(new Date('2026-01-05T00:00:00.000Z'))).toBe(
				'Jan 5, 2026',
			);
		},
	);

	it('accepts an ISO string', () => {
		expect(formatDate('2026-03-09T00:00:00.000Z')).toBe('Mar 9, 2026');
	});
});

describe('formatRelativeDate', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-10-03T12:00:00.000Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('uses relative wording within a year', () => {
		expect(formatRelativeDate('2026-10-01T12:00:00.000Z')).toBe('2 days ago');
	});

	it('falls back to the year once a date is a year old', () => {
		expect(formatRelativeDate('2025-10-03T12:00:00.000Z')).toBe('2025');
	});

	it('still uses relative wording just under a year', () => {
		expect(formatRelativeDate('2025-10-04T12:00:00.000Z')).toMatch(/ago$/);
	});
});
