<script setup lang="ts">
import type { ValuePoint } from "../../types/home";

defineProps<{
  points: ValuePoint[];
}>();
</script>

<template>
  <section id="why-follow" class="section value-section">
    <div class="section-inner two-column">
      <div class="section-heading">
        <p class="eyebrow">Why It Matters</p>
        <h2>我们的目标</h2>
        <p>
          相较于活跃度，我们更看重群聊质量，期望能维护一个可以平心静气就事论事的键政群组：在AI规约下，引导大家将持有的观点、证据进行互相校准。
        </p>
      </div>

      <div class="value-grid">
        <article v-for="point in points" :key="point.title" class="value-card">
          <h3>{{ point.title }}</h3>
          <p>{{ point.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
