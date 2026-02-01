/// <reference types="astro/client" />
/// <reference types="astro/content" />

declare module '*.svg?raw' {
  const content: string
  export default content
}
