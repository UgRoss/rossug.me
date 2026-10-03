# A custom --text-weight variable instead of Tailwind's --tw-font-weight

**Status: superseded (2026-10-03).** The `--text-weight` variable and the
`.font-semibold` override are gone. No link in the site sits inside a
semibold ancestor, so the "100 heavier than the surrounding text" rule always
resolved to 500; links now use a fixed `font-weight: var(--font-weight-medium)`,
which is also the typography plugin's own link weight. The record below is
kept for history.

Links inside rich-text content are meant to render 100 font-weight
heavier than their surrounding text, computed relative to whatever
ancestor weight applies. Tailwind's own `--tw-font-weight` custom
property looks like the natural way to read that ancestor weight, but
it's registered via `@property` with `inherits: false`, so it silently
doesn't cascade to a descendant the way a normal custom property would —
confirmed directly by inspecting computed styles, not assumed.
`global.css` defines a separate `--text-weight` variable that mirrors
the same two weights the site actually uses (`font-normal`/`font-semibold`)
but does inherit normally, and the link rule reads from that instead.
