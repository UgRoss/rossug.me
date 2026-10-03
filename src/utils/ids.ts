/** Stable id for a section's heading, used to label the section via aria-labelledby. */
export const headingId = (title: string): string =>
	`${title.toLowerCase().replace(/\s+/g, '-')}-title`;
