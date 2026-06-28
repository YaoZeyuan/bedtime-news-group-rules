<script setup lang="ts">
import type { CulturePoint } from "../../types/home";

defineProps<{
  points: CulturePoint[];
}>();
</script>

<template>
  <section class="section about-section">
    <div class="section-inner two-column">
      <div class="section-heading">
        <p class="eyebrow">Community Brief</p>
        <h2>群组简介</h2>
        <p>
          本群是“睡前消息”观众自发组建的非官方讨论群，目标是通过资料共享、逻辑推演与相互校准，
          让最终聊天内容值得每日通读。
        </p>
        <p>
          讨论秩序由群规、AI
          判定和管理员执行共同维护。规则不是摆设，而是会被提审、释义、修订并留下版本记录。
        </p>
      </div>

      <div class="culture-grid">
        <article v-for="point in points" :key="point.title" class="culture-card">
          <h3>{{ point.title }}</h3>
          <p>{{ point.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
