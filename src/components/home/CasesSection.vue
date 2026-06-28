<script setup lang="ts">
import type { CaseRecord, ChangelogItem, RuleStatus } from "../../types/home";

defineProps<{
  caseStatus: RuleStatus;
  caseStatusText: string;
  caseError: string;
  casesUrl: string;
  changelogUrl: string;
  caseSearch: string;
  caseRecords: CaseRecord[];
  filteredCaseRecords: CaseRecord[];
  selectedCaseRecord: CaseRecord | null;
  changelogItems: ChangelogItem[];
}>();

const emit = defineEmits<{
  "update:caseSearch": [value: string];
  reload: [];
  select: [recordId: string];
}>();

function onSearchInput(event: Event) {
  emit("update:caseSearch", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <section id="cases" class="section cases-section">
    <div class="section-inner">
      <div class="case-browser-heading">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Case Law</p>
          <h2>释规记录库</h2>
          <p>
            释规用于解释边界案例，帮助群管和群友理解“这条规则到底怎么用”。记录内容来自公开维护的
            case-database.md。
          </p>
        </div>

        <div class="rules-actions case-actions">
          <span class="status-pill" :class="`status-${caseStatus}`">{{
            caseStatusText
          }}</span>
          <button class="button" type="button" @click="emit('reload')">
            重新读取
          </button>
          <a class="button" :href="casesUrl" target="_blank" rel="noreferrer"
            >查看原文</a
          >
        </div>
      </div>

      <p v-if="caseStatus === 'fallback'" class="fallback-notice">
        GitHub Raw 暂时不可用：{{
          caseError
        }}。当前展示的是随网站构建内置的本地快照。
      </p>

      <div class="case-tools">
        <label class="case-search-control">
          <span>搜索释规记录</span>
          <input
            :value="caseSearch"
            type="search"
            placeholder="Top3 / AI / 警告 / 图片审判"
            @input="onSearchInput"
          />
        </label>
        <p>
          共 {{ caseRecords.length }} 条，当前显示
          {{ filteredCaseRecords.length }} 条
        </p>
      </div>

      <div class="case-browser">
        <aside class="case-index" aria-label="释规记录列表">
          <button
            v-for="record in filteredCaseRecords"
            :key="record.id"
            class="case-index-item"
            :class="{ 'is-active': selectedCaseRecord?.id === record.id }"
            type="button"
            :aria-pressed="selectedCaseRecord?.id === record.id"
            @click="emit('select', record.id)"
          >
            <span>{{ record.id }}</span>
            <strong>{{ record.title }}</strong>
            <small>{{ record.excerpt }}</small>
          </button>

          <p v-if="filteredCaseRecords.length === 0" class="case-empty">
            没有匹配的释规记录。
          </p>
        </aside>

        <article v-if="selectedCaseRecord" class="case-detail">
          <div class="case-detail-head">
            <span>{{ selectedCaseRecord.id }}</span>
            <h3>{{ selectedCaseRecord.title }}</h3>
          </div>
          <div
            class="markdown-body case-detail-body"
            v-html="selectedCaseRecord.html"
          ></div>
        </article>
      </div>

      <div id="changelog" class="case-changelog">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Changelog</p>
          <h2>变更记录</h2>
          <p>群规通过 Git 持续演进，重大调整会进入版本记录。</p>
        </div>

        <div>
          <div class="timeline">
            <article
              v-for="item in changelogItems"
              :key="item.version"
              class="timeline-item"
            >
              <span>{{ item.date }}</span>
              <h3>v{{ item.version }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <a
            class="button button-primary"
            :href="changelogUrl"
            target="_blank"
            rel="noreferrer"
            >查看完整变更记录</a
          >
        </div>
      </div>
    </div>
  </section>
</template>
