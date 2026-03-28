---
title: 'URLSearchParams'
pubDate: '2020-12-30'
category: 'JavaScript'
---

Utility methods to work with URL query strings.

## Example

Given URL: `https://iframe.link/?id=123&locale=en_US&color=#2364AA`

```javascript
const searchParams = new URLSearchParams(window.location.search)

const config = {
  id: searchParams.get('id'), // "123"
  language: searchParams.get('locale'), // "en_US"
  color: searchParams.get('color') // "#2364AA" (auto-decoded)
}
```

## Methods

```javascript
// Check if parameter exists
searchParams.has('id') // true

// Remove parameter
searchParams.delete('id')

// Add parameter
searchParams.append('title', 'Awesome Title')

// Get query string for URL
searchParams.toString() // "language=english&color=&title=Awesome+Title"
```
