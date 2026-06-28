<script setup lang="ts">
import type { RuleCard } from "../../types/home";

defineProps<{
  cards: RuleCard[];
}>();
</script>

<template>
  <section class="section rules-overview">
    <div class="section-inner">
      <div class="section-heading compact-heading">
        <p class="eyebrow">Rule Overview</p>
        <h2>核心规则速览</h2>
        <p>
          先看机制，再读全文。群规强调事实、证据、逻辑链条和可执行的讨论秩序。
        </p>
      </div>

      <div class="rule-card-grid">
        <article v-for="card in cards" :key="card.title" class="rule-card">
          <h3>{{ card.title }}</h3>
          <p>{{ card.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
