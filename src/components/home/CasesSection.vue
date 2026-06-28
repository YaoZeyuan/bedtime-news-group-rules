<script setup lang="ts">
import { ref } from "vue";
import type { RuleStatus } from "../../types/home";

defineProps<{
  caseStatus: RuleStatus;
  caseStatusText: string;
  caseError: string;
  casesUrl: string;
  renderedCases: string;
}>();

const emit = defineEmits<{
  reload: [];
}>();

const isExpanded = ref(false);
</script>

<template>
  <section id="cases" class="section cases-section">
    <div class="section-inner">
      <div class="rules-toolbar">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Case Law</p>
          <h2>释规记录</h2>
          <p>
            释规用于解释边界案例，帮助群管和群友理解“这条规则到底怎么用”。原始文本位于
            GitHub 上的
            <a :href="casesUrl" target="_blank" rel="noreferrer"
              >case-database.md</a
            >。
          </p>
        </div>

        <div class="rules-actions">
          <span class="status-pill" :class="`status-${caseStatus}`">{{
            caseStatusText
          }}</span>
          <button
            class="button button-primary"
            type="button"
            aria-controls="cases-document"
            :aria-expanded="isExpanded"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? "收起全文" : "展开文档" }}
          </button>
          <button class="button" type="button" @click="emit('reload')">
            重新读取
          </button>
          <a class="button" :href="casesUrl" target="_blank" rel="noreferrer"
            >查看原文</a
          >
        </div>
      </div>

      <p v-if="isExpanded && caseStatus === 'fallback'" class="fallback-notice">
        GitHub Raw 暂时不可用：{{
          caseError
        }}。当前展示的是随网站构建内置的本地快照。
      </p>

      <article
        v-if="isExpanded"
        id="cases-document"
        class="markdown-body"
        v-html="renderedCases"
      ></article>
    </div>
  </section>
</template>
