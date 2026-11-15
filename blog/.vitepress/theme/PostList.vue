<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'
import type { PostLang } from './posts.data'

// The posts of one language, newest first, as cards.
const props = defineProps<{ lang: PostLang }>()
const list = computed(() => posts.filter((post) => post.lang === props.lang))
</script>

<template>
  <ul class="post-list">
    <li v-for="post in list" :key="post.url">
      <a class="post-card" :href="withBase(post.url)">
        <span class="post-card-meta">{{ post.date }}<template v-if="post.tag">&emsp;{{ post.tag }}</template></span>
        <span class="post-card-title">{{ post.title }}</span>
        <span class="post-card-summary">{{ post.description }}</span>
      </a>
    </li>
  </ul>
</template>
