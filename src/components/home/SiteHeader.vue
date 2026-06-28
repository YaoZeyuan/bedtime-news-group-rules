<script setup lang="ts">
import type { NavItem } from "../../types/home";

defineProps<{
  navItems: NavItem[];
  activeSectionId: string;
}>();

const emit = defineEmits<{
  navigate: [event: MouseEvent, href: string];
}>();
</script>

<template>
  <header class="site-header">
    <a
      class="brand"
      href="#top"
      aria-label="回到首页"
      @click="emit('navigate', $event, '#top')"
    >
      <span class="brand-mark">睡前<br />消息</span>
      <span>睡前消息讨论组</span>
      <small>非官方</small>
    </a>

    <nav class="site-nav" aria-label="站内导航">
      <a
        v-for="item in navItems"
        :key="item.id"
        :class="{ 'is-active': activeSectionId === item.id }"
        :href="`#${item.id}`"
        :aria-current="activeSectionId === item.id ? 'location' : undefined"
        @click="emit('navigate', $event, `#${item.id}`)"
        >{{ item.label }}</a
      >
    </nav>
  </header>
</template>
