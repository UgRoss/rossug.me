# A custom --text-weight variable instead of Tailwind's --tw-font-weight

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
