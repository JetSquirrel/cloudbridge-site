import { createContentLoader } from 'vitepress'

// Every post, newest first, read from its frontmatter at build time, so a new
// post appears on its blog's front page without anyone editing a list.
export interface Post {
  url: string
  title: string
  description: string
  date: string
  tag: string
  zh: boolean
}

declare const data: Post[]
export { data }

export default createContentLoader(['*.md', 'zh/*.md'], {
  transform(pages): Post[] {
    return pages
      .filter((page) => page.frontmatter.date)
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title,
        description: page.frontmatter.description,
        date: new Date(page.frontmatter.date).toISOString().slice(0, 10),
        tag: page.frontmatter.tag ?? '',
        zh: page.url.startsWith('/zh/'),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
