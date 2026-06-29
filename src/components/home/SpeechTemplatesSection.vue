<script setup lang="ts">
import { ref } from "vue";
import type { RuleStatus, SpeechTemplateConfig } from "../../types/home";

defineProps<{
  templateConfig: SpeechTemplateConfig;
  templateStatus: RuleStatus;
  templateStatusText: string;
  templateError: string;
  templateSourceUrl: string;
}>();

const emit = defineEmits<{
  reload: [];
}>();

const copiedMessageId = ref("");
const failedMessageId = ref("");
let feedbackTimer = 0;

async function copyMessage(id: string, text: string) {
  clearFeedbackTimer();
  failedMessageId.value = "";

  try {
    await copyText(text);
    copiedMessageId.value = id;
  } catch {
    copiedMessageId.value = "";
    failedMessageId.value = id;
  }

  feedbackTimer = window.setTimeout(() => {
    copiedMessageId.value = "";
    failedMessageId.value = "";
    feedbackTimer = 0;
  }, 1800);
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const succeeded = document.execCommand("copy");
    if (!succeeded) {
      throw new Error("copy command failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function clearFeedbackTimer() {
  if (!feedbackTimer) return;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = 0;
}
</script>

<template>
  <section id="speech-templates" class="section speech-section">
    <div class="section-inner">
      <div class="rules-toolbar">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Admin Toolkit</p>
          <h2>常用话术</h2>
          <p>
            面向管理员的复制工具，内容来自
            <a :href="templateSourceUrl" target="_blank" rel="noreferrer"
              >话术模版.json</a
            >。后续新增话术只需要维护 JSON 配置。
          </p>
        </div>

        <div class="rules-actions">
          <span class="status-pill" :class="`status-${templateStatus}`">{{
            templateStatusText
          }}</span>
          <button class="button" type="button" @click="emit('reload')">
            重新读取
          </button>
          <a
            class="button"
            :href="templateSourceUrl"
            target="_blank"
            rel="noreferrer"
            >查看配置</a
          >
        </div>
      </div>

      <p v-if="templateStatus === 'fallback'" class="fallback-notice">
        GitHub Raw 暂时不可用或配置格式有误：{{
          templateError
        }}。当前展示的是随网站构建内置的本地快照。
      </p>

      <div class="speech-group-list">
        <section
          v-for="group in templateConfig.groups"
          :key="group.id"
          class="speech-group"
        >
          <div class="speech-group-head">
            <h3>{{ group.title }}</h3>
            <p v-if="group.description">{{ group.description }}</p>
          </div>

          <div class="speech-case-list">
            <article
              v-for="item in group.cases"
              :key="item.id"
              class="speech-case"
            >
              <div class="speech-case-head">
                <h4>{{ item.title }}</h4>
                <p v-if="item.description">{{ item.description }}</p>
              </div>

              <div class="speech-message-list">
                <article
                  v-for="message in item.messages"
                  :key="message.id"
                  class="speech-message"
                >
                  <div class="speech-message-head">
                    <strong>{{ message.title }}</strong>
                    <button
                      class="button speech-copy-button"
                      type="button"
                      @click="copyMessage(message.id, message.text)"
                    >
                      {{
                        copiedMessageId === message.id
                          ? "已复制"
                          : failedMessageId === message.id
                            ? "复制失败"
                            : "复制话术"
                      }}
                    </button>
                  </div>

                  <pre>{{ message.text }}</pre>
                </article>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
