interface Draftable {
	data: { draft: boolean };
}

/** Drafts show up while developing and never reach a production build. */
const showDraftsByDefault = import.meta.env.DEV;

export const isPublished = (
	entry: Draftable,
	includeDrafts = showDraftsByDefault,
): boolean => includeDrafts || !entry.data.draft;
