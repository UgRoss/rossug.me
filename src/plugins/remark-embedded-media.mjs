import { visit } from 'unist-util-visit'

/**
 * A remark plugin that converts custom directives to embedded media HTML elements
 * Supports: link cards, Spotify, YouTube, Bilibili, X posts, and GitHub repository cards
 */
const embedHandlers = {
  // Bilibili
  bilibili: (node) => {
    let bvid = node.attributes?.id ?? ''
    const url = node.attributes?.url ?? ''
    if (!bvid && url) {
      const match = url.match(/\/BV([\w]+)/)
      if (match) bvid = 'BV' + match[1]
    }
    if (!bvid) {
      return false
    }

    return `
    <figure>
      <iframe
        style="border-radius:6px"
        src="//player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&p=1&autoplay=0&muted=0"
        title="Bilibili video player"
        loading="lazy"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
      ></iframe>
    </figure>
    `
  },

  // Spotify
  spotify: (node) => {
    const url = node.attributes?.url ?? ''
    if (!url) {
      return false
    }
    if (!/^https:\/\/open\.spotify\.com\//.test(url)) {
      return false
    }
    let embedUrl = url.replace('open.spotify.com/', 'open.spotify.com/embed/')
    if (!embedUrl.includes('utm_source=')) {
      embedUrl += (embedUrl.includes('?') ? '&' : '?') + 'utm_source=generator'
    }

    let height = '152'
    if (
      url.includes('/album/') ||
      url.includes('/playlist/') ||
      url.includes('/artist/') ||
      url.includes('/show/')
    ) {
      height = '352'
    }

    return `
    <figure>
      <iframe
        style="border-radius:12px"
        src="${embedUrl}"
        width="100%"
        height="${height}"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </figure>
    `
  },

  // Youtube
  youtube: (node) => {
    let videoId = node.attributes?.id ?? ''
    const url = node.attributes?.url ?? ''

    if (!videoId && url) {
      const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([\w-]{11})/)
      if (match) videoId = match[1]
    }

    if (!videoId) {
      return false
    }

    return `
    <figure>
      <iframe
        style="border-radius:6px"
        src="https://www.youtube.com/embed/${videoId}"
        title="YouTube video player"
        loading="lazy"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </figure>
    `
  }
}

export default function remarkEmbeddedMedia() {
  return (tree) => {
    visit(tree, ['leafDirective', 'containerDirective', 'textDirective'], (node) => {
      const handler = embedHandlers[node.name]
      if (!handler) {
        return
      }

      const htmlContent = handler(node)
      if (!htmlContent) {
        return
      }

      node.type = 'html'
      node.value = htmlContent
      delete node.name
      delete node.attributes
      delete node.children
    })
  }
}
