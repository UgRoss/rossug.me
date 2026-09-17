# Client-side pagination for notes, not Astro's paginate()

The blog list paginates via Astro's `paginate()`, generating a separate
static route per page (`/blog/2/`, `/blog/3/`, ...). The notes list
deliberately doesn't follow that pattern: it needs every note available
client-side anyway for search to work across the whole collection, so
splitting the same data across static per-page routes would only fight
against that. Pagination there is plain React state over the
already-fully-loaded list instead.
