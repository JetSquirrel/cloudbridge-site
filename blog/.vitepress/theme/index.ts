import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
// The docs' colours and post styles, so the blog and the docs read as one site.
import '../../../docs/.vitepress/theme/custom.css'
import './blog.css'
import PostList from './PostList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostList', PostList)
  },
} satisfies Theme
