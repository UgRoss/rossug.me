import type { ThemeConfig } from './types'

export const themeConfig: ThemeConfig = {
  // GENERAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////
  general: {
    contentWidth: '38rem', // Content area width
    fadeAnimation: true, // Enable fade animations
    footer: true, // Show footer
    postListDottedDivider: false, // Show dotted divider in post list
    themeToggle: false // Show theme toggle button (uses system theme by default)
  },

  // PAGINATION SETTINGS /////////////////////////////////////////////////////////////////////////////////
  pagination: {
    blog: 10, // Number of posts per page
    til: 10 // Number of TILs per page
  },

  // POST SETTINGS ///////////////////////////////////////////////////////////////////////////////////////
  post: {
    copyCode: true, // Enable copy button in code blocks
    imageViewer: true // Enable image viewer
  },

  // SITE INFO ///////////////////////////////////////////////////////////////////////////////////////////
  site: {
    author: 'Rostyslav Ugryniuk', // Author name
    description: 'Minimal personal site built with Astro and TailwindCSS', // Site description
    language: 'en-US', // Default language
    title: 'rossug.me', // Site title
    website: 'https://rossug.me/' // Site domain
  }
}
