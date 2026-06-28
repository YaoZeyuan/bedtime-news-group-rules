<script setup lang="ts">
import type { HeroAction, Principle } from "../../types/home";

defineProps<{
  heroImage: string;
  heroActions: HeroAction[];
  principles: Principle[];
}>();

const emit = defineEmits<{
  navigate: [event: MouseEvent, href: string];
}>();
</script>

<template>
  <section class="hero-section">
    <img class="hero-art" :src="heroImage" alt="" aria-hidden="true" />
    <div class="section-inner hero-content">
      <p class="eyebrow">Unofficial Bedtime Group</p>
      <h1>睡前消息讨论组</h1>
      <p class="hero-copy">
        一个观众自发维护的非官方讨论组。这里用资料、逻辑、AI
        校准和成文规则，试图维护一个值得每日通读的小宇宙。
      </p>

      <div class="hero-actions" aria-label="主要入口">
        <a
          v-for="action in heroActions"
          :key="action.href"
          class="button button-primary"
          :href="action.href"
          @click="emit('navigate', $event, action.href)"
        >
          {{ action.label }}
        </a>
      </div>

      <dl class="principle-strip" aria-label="规则运行关键机制">
        <div v-for="item in principles" :key="item.label">
          <dt>{{ item.value }}</dt>
          <dd>{{ item.label }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
