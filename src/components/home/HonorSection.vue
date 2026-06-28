<script setup lang="ts">
import type { HonorTier, Supporter } from "../../types/home";

defineProps<{
  sponsorUrl: string;
  ledgerUrl: string;
  supporterThanks: Supporter[];
  rollingSupporters: Supporter[];
  sponsorGuideImage: string;
  honorTiers: HonorTier[];
}>();
</script>

<template>
  <section id="honor" class="section honor-section">
    <div class="section-inner">
      <div class="honor-feature">
        <div>
          <div class="section-heading">
            <p class="eyebrow">Honor Hall</p>
            <h2>荣誉殿堂</h2>
            <p>
              AI
              判定、机器人维护和公开资料整理都需要持续成本。荣誉殿堂用于感谢发电群友，也让电费和
              Token 成本能被公开追踪。
            </p>
            <p>
              高阶档位默认拥有其下所有档位权限；以下名单仅展示匿名称呼与历史最高发电档位。
            </p>
          </div>

          <div class="honor-actions">
            <a
              class="button button-primary"
              :href="sponsorUrl"
              target="_blank"
              rel="noreferrer"
              >爱发电赞助计划</a
            >
            <a class="button" :href="ledgerUrl" target="_blank" rel="noreferrer"
              >查看收支明细</a
            >
          </div>

          <div class="supporter-panel" aria-label="发电群友感谢名单">
            <div class="supporter-panel-head">
              <span>{{ supporterThanks.length }} 位</span>
              <strong>感谢发电群友(名单截至2026-06)</strong>
            </div>
            <div class="supporter-marquee">
              <div class="supporter-track">
                <span
                  v-for="(supporter, index) in rollingSupporters"
                  :key="`${supporter.name}-${supporter.tier}-${index}`"
                  class="supporter-chip"
                >
                  <b>{{ supporter.name }}</b>
                  <small>{{ supporter.tier }}</small>
                </span>
              </div>
            </div>
          </div>
        </div>

        <figure class="sponsor-guide-card">
          <img :src="sponsorGuideImage" alt="发电档位与权限说明" />
          <figcaption>发电档位与权限说明</figcaption>
        </figure>
      </div>

      <p class="tier-note">
        档位按权益递进展示：后续每一级默认继承之前全部权益，并追加本级专属权限。
      </p>

      <div class="tier-grid">
        <article v-for="tier in honorTiers" :key="tier.title" class="tier-card">
          <div>
            <h3>{{ tier.title }}</h3>
            <p class="tier-amount">{{ tier.amount }}</p>
          </div>
          <p>{{ tier.privilege }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
