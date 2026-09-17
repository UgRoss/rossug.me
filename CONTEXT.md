# rossug.me

Rostyslav "Ross" Ugryniuk's personal site — long-form posts, short
day-to-day learnings, and a bio, built as a static Astro site.

## Language

**Post**:
A long-form, dated piece of writing. Always has a Description, shown
beneath its title in the blog list.
_Avoid_: Article, blog entry

**Note**:
A short "Today I Learned" entry capturing one quick discovery, tagged
with exactly one Category.
_Avoid_: TIL, TIL item

**Category**:
The single, fixed classification a Note belongs to — exactly one per
Note, not several.
_Avoid_: Tag, tags

**Description**:
A short summary written separately from a Post or Note's body. Required
and always displayed for a Post; for a Note it's optional and only
improves search matching, never displayed.
_Avoid_: Excerpt

**Bio**:
The personal introduction shown at the top of the homepage.
_Avoid_: About — the content collection backing it is named `about`,
but there's no separate `/about` page; it only ever renders inline on
the homepage.
