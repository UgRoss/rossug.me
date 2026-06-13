import type { Root } from 'mdast'
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive'

import { visit } from 'unist-util-visit'

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective
type EmbedHandler = (node: DirectiveNode) => false | string

/**
 * A remark plugin that converts custom directives to embedded media HTML elements.
 * Supports: Bilibili, Spotify, and YouTube.
 */
const embedHandlers: Record<string, EmbedHandler> = {
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
  return (tree: Root): void => {
    visit(tree, ['leafDirective', 'containerDirective', 'textDirective'], (node) => {
      const directive = node as DirectiveNode
      const handler = embedHandlers[directive.name]
      if (!handler) {
        return
      }

      const htmlContent = handler(directive)
      if (!htmlContent) {
        return
      }

      // Rewrite the directive node in place into a raw HTML node, dropping the
      // now-irrelevant directive fields
      const mutable = node as unknown as {
        attributes?: unknown
        children?: unknown
        name?: unknown
        type: string
        value: string
      }
      mutable.type = 'html'
      mutable.value = htmlContent
      delete mutable.name
      delete mutable.attributes
      delete mutable.children
    })
  }
}
