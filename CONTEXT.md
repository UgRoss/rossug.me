# rossug.me

Rostyslav "Ross" Ugryniuk's personal site — long-form posts, short
day-to-day learnings, and a bio, built as a static Astro site.

## Language

**Post**:
A long-form, dated piece of writing. Always has a Description and may
have a hero image and any number of Tags.
_Avoid_: Article, blog entry

The list of Posts is labelled "Posts" in the nav and as its page title; the
route stays `/blog/` and the collection is `blog`.

**Note**:
A short "Today I Learned" entry capturing one quick discovery, tagged
with exactly one Category.
_Avoid_: TIL, TIL item

The Notes list page is titled "Today I Learned" (its heading and document
title); everywhere else, including the nav, they are just "Notes".

**Category**:
The single, fixed classification a Note belongs to — exactly one per
Note, not several.
_Avoid_: Tag, tags — those belong to Posts

**Tag**:
A free-form label on a Post; a Post can have zero or more. Shown as
`#tag` under the title.
_Avoid_: Category — that is the one-per-Note classification

**Description**:
A short summary written separately from a Post or Note's body. Required
for a Post, where it feeds the page's meta description and is not shown
in the blog list; for a Note it's optional and only improves search
matching, never displayed.
_Avoid_: Excerpt

**Bio**:
The personal introduction shown at the top of the homepage.
_Avoid_: About — the content collection backing it is named `about`,
but there's no separate `/about` page; it only ever renders inline on
the homepage.

**Draft**:
A Post or Note with `draft: true` in its frontmatter. Drafts render while
developing (`astro dev`) and are left out of production builds, so they never
reach pages, listings, RSS or the sitemap.
