<script setup lang="ts">
import type { RuleStatus } from "../../types/home";

defineProps<{
  ruleSourceUrl: string;
  ruleStatus: RuleStatus;
  ruleStatusText: string;
  ruleError: string;
  renderedRules: string;
}>();

const emit = defineEmits<{
  reload: [];
}>();
</script>

<template>
  <section id="rules" class="section rules-section">
    <div class="section-inner">
      <div class="rules-toolbar">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Live Rules</p>
          <h2>群规全文</h2>
          <p>
            原始文本位于 GitHub 上的
            <a :href="ruleSourceUrl" target="_blank" rel="noreferrer"
              >main/群组文档/rule.md</a
            >。
          </p>
        </div>

        <div class="rules-actions">
          <span class="status-pill" :class="`status-${ruleStatus}`">{{
            ruleStatusText
          }}</span>
          <button class="button" type="button" @click="emit('reload')">
            重新读取
          </button>
          <a class="button" :href="ruleSourceUrl" target="_blank" rel="noreferrer"
            >查看原文</a
          >
        </div>
      </div>

      <p v-if="ruleStatus === 'fallback'" class="fallback-notice">
        GitHub Raw 暂时不可用：{{
          ruleError
        }}。当前展示的是随网站构建内置的本地快照。
      </p>

      <article class="markdown-body" v-html="renderedRules"></article>
    </div>
  </section>
</template>
