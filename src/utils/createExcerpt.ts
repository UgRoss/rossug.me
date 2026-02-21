import { convert } from 'html-to-text'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()
const HTML_TO_TEXT_OPTIONS = {
  selectors: [
    { options: { ignoreHref: true }, selector: 'a' },
    { format: 'skip', selector: 'img' },
    { format: 'skip', selector: 'figure' },
    { format: 'skip', selector: 'pre' },
    { format: 'skip', selector: 'code' },
    { format: 'skip', selector: 'hr' }
  ],
  wordwrap: null
}

export const createExcerpt = (body: string): string => {
  const html = parser.render(body)

  const text = convert(html, HTML_TO_TEXT_OPTIONS)
  return text.trim()
}
