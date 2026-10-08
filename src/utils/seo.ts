export const pageTitle = (title: string, siteTitle: string): string =>
	title === siteTitle ? title : `${title} · ${siteTitle}`;
