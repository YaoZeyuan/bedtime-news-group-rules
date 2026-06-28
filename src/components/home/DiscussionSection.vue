<script setup lang="ts">
import type { DiscussionHighlight } from "../../types/home";

defineProps<{
  items: DiscussionHighlight[];
}>();
</script>

<template>
  <section id="field-notes" class="section field-notes-section">
    <div class="section-inner">
      <div class="section-heading">
        <p class="eyebrow">Field Notes</p>
        <h2>先看看这个群聊什么</h2>
        <p>
          以下内容来自历史群聊梳理的脱敏归纳：基于原始记录，遮蔽发言身份，只保留主题、问题意识和讨论方式。可以在入群后发送指令如「梳理20260601」查看对应日期的群聊总结
        </p>
      </div>

      <div class="discussion-grid">
        <article v-for="item in items" :key="item.topic" class="discussion-card">
          <div class="discussion-card-head">
            <span>{{ item.topic }}</span>
            <div class="discussion-tags" aria-label="讨论标签">
              <small v-for="tag in item.tags" :key="tag">{{ tag }}</small>
            </div>
          </div>
          <h3>{{ item.question }}</h3>
          <p>{{ item.detail }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
