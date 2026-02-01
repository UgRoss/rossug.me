import type { ThemeConfig } from './types'

export const themeConfig: ThemeConfig = {
  // DATE SETTINGS ///////////////////////////////////////////////////////////////////////////////////////
  date: {
    dateFormat: 'YYYY-MM-DD', // Date format: YYYY-MM-DD, MM-DD-YYYY, DD-MM-YYYY, MONTH DAY YYYY, DAY MONTH YYYY
    dateOnRight: true, // Date position in post list (true for right, false for left)
    dateSeparator: '.' // Date separator: . - / (except for MONTH DAY YYYY and DAY MONTH YYYY)
  },

  // GENERAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////
  general: {
    centeredLayout: true, // Use centered layout (false for left-aligned)
    contentWidth: '35rem', // Content area width
    fadeAnimation: true, // Enable fade animations
    footer: true, // Show footer
    postListDottedDivider: false, // Show dotted divider in post list
    themeToggle: false // Show theme toggle button (uses system theme by default)
  },

  // POST SETTINGS ///////////////////////////////////////////////////////////////////////////////////////
  post: {
    copyCode: true, // Enable copy button in code blocks
    imageViewer: true, // Enable image viewer
    linkCard: false, // Enable link card (requires server adapter)
    readingTime: false, // Show reading time in posts
    toc: true // Show table of contents (when there is enough page width)
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
