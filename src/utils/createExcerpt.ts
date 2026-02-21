import { convert } from 'html-to-text'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export const createExcerpt = (body: string): string => {
  const html = parser.render(body)
  const options = {
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
  const text = convert(html, options)
  const distilled = convert(text, options)
  return distilled.trim()
}
