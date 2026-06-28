<script setup lang="ts">
import type { LinkGroup } from "../../types/home";

defineProps<{
  links: LinkGroup[];
}>();
</script>

<template>
  <section id="links" class="section links-section">
    <div class="section-inner">
      <div class="section-heading compact-heading">
        <p class="eyebrow">Public Entries</p>
        <h2>公开入口</h2>
        <p>可以从这里查看群组公开资料、赞助计划、收支明细与工具说明。</p>
      </div>

      <div class="link-grid">
        <a
          v-for="link in links"
          :key="link.href"
          class="link-card"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
        >
          <span>{{ link.label }}</span>
          <small>{{ link.description }}</small>
        </a>
      </div>
    </div>
  </section>
</template>
