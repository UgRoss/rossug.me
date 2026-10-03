/** "Posts · Rostyslav Ugryniuk" for inner pages; the home page is just the site name. */
export const pageTitle = (title: string, siteTitle: string): string =>
	title === siteTitle ? title : `${title} · ${siteTitle}`;
