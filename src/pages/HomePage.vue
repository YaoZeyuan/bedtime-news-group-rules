<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import fallbackRules from "../../群组文档/rule.md?raw";
import fallbackCases from "../../群组文档/释规案例库/case-database.md?raw";
import fallbackSpeechTemplates from "../../群组文档/常用话术/话术模版.json?raw";
import heroImage from "../assets/hero.png";
import sponsorGuideImage from "../assets/爱发电权益说明.jpg";
import AboutSection from "../components/home/AboutSection.vue";
import CasesSection from "../components/home/CasesSection.vue";
import DiscussionSection from "../components/home/DiscussionSection.vue";
import HeroSection from "../components/home/HeroSection.vue";
import HonorSection from "../components/home/HonorSection.vue";
import LinksSection from "../components/home/LinksSection.vue";
import RulesOverviewSection from "../components/home/RulesOverviewSection.vue";
import RulesSection from "../components/home/RulesSection.vue";
import SiteFooter from "../components/home/SiteFooter.vue";
import SiteHeader from "../components/home/SiteHeader.vue";
import SpeechTemplatesSection from "../components/home/SpeechTemplatesSection.vue";
import ValueSection from "../components/home/ValueSection.vue";
import type { RuleStatus, SpeechTemplateConfig } from "../types/home";
import { renderMarkdown } from "../utils/markdown";
import { parseSpeechTemplateConfig } from "../utils/speechTemplates";

const repoUrl = "https://github.com/YaoZeyuan/bedtime-news-group-rules";
const encodedRulePath = "%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/rule.md";
const encodedCasePath =
  "%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/%E9%87%8A%E8%A7%84%E6%A1%88%E4%BE%8B%E5%BA%93/case-database.md";
const encodedSpeechTemplatePath =
  "%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/%E5%B8%B8%E7%94%A8%E8%AF%9D%E6%9C%AF/%E8%AF%9D%E6%9C%AF%E6%A8%A1%E7%89%88.json";
const ruleRawUrl = `https://raw.githubusercontent.com/YaoZeyuan/bedtime-news-group-rules/main/${encodedRulePath}`;
const caseRawUrl = `https://raw.githubusercontent.com/YaoZeyuan/bedtime-news-group-rules/main/${encodedCasePath}`;
const speechTemplateRawUrl = `https://raw.githubusercontent.com/YaoZeyuan/bedtime-news-group-rules/main/${encodedSpeechTemplatePath}`;
const ruleSourceUrl = `${repoUrl}/blob/main/${encodedRulePath}`;
const changelogUrl = `${repoUrl}/blob/main/%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/changelog.md`;
const casesUrl = `${repoUrl}/blob/main/${encodedCasePath}`;
const speechTemplateSourceUrl = `${repoUrl}/blob/main/${encodedSpeechTemplatePath}`;
const sponsorUrl = "https://ifdian.net/a/bedtime-news-group/plan";
const ledgerUrl = "https://docs.qq.com/space/DY3J6YnhJRGttTGJM";
const aiRankingUrl = "http://t.cn/AXbn82u3";
const botGuideUrl = "https://bit.ly/43SVCsW";

const ruleMarkdown = ref(fallbackRules);
const ruleStatus = ref<RuleStatus>("loading");
const ruleError = ref("");
const loadedAt = ref("");
const caseMarkdown = ref(fallbackCases);
const caseStatus = ref<RuleStatus>("loading");
const caseError = ref("");
const casesLoadedAt = ref("");
const speechTemplates = ref<SpeechTemplateConfig>(
  parseSpeechTemplateConfig(fallbackSpeechTemplates),
);
const speechTemplateStatus = ref<RuleStatus>("loading");
const speechTemplateError = ref("");
const speechTemplatesLoadedAt = ref("");

const heroActions = [
  { label: "围观讨论现场", href: "#field-notes" },
  { label: "我们看重什么", href: "#why-follow" },
  { label: "群规全文", href: "#rules" },
  { label: "释规记录", href: "#cases" },
  { label: "常用话术", href: "#speech-templates" },
  { label: "资料导航", href: "#links" },
];

const navItems = [
  { label: "讨论现场", id: "field-notes" },
  { label: "规则全文", id: "rules" },
  // { label: "释规记录", id: "cases" },
  { label: "常用话术", id: "speech-templates" },
  { label: "荣誉殿堂", id: "honor" },
  { label: "资料导航", id: "links" },
];

// 跳转时的安全边距，这里配置为0，以保障视觉效果
const anchorScrollGap = 0;
const activeSectionId = ref("");

const principles = [
  { value: "AI", label: "辅助裁定" },
  { value: "3次", label: "警告移出阈值" },
  { value: "24h", label: "默认警告有效期" },
  { value: "Git", label: "规则版本管理" },
];

const discussionHighlights = [
  {
    topic: "AI 与产业现实",
    question: "“国产 AI 已经完全自主”这类说法，哪些有证据，哪些只是营销叙事？",
    detail:
      "讨论从芯片、训练、推理、部署成本和行业反馈进行拆解。有人提出乐观判断，也有人用具体采购和部署经验降温，最后通常落到“证据链够不够完整”。",
    tags: ["AI", "产业", "证据链"],
  },
  {
    topic: "社会政策与公共议题",
    question:
      "生育补贴、教育资源、劳动制度这类问题，应该看共识、效率，还是长期结构？",
    detail:
      "群友会把政策目标、现实约束和个人经验放在同一张桌上讨论。观点可以激烈，但需要说明推理路径，不能只用立场替代论证。",
    tags: ["政策", "社会", "推演"],
  },
  {
    topic: "规则自治现场",
    question: "当 AI 判定、管理员执行和群友申诉发生冲突时，规则如何继续迭代？",
    detail:
      "群内会围绕警告有效期、Top3 机制、释规边界和管理员责任继续修订成文规则。规则不是装饰，而是会在争议中被测试。",
    tags: ["AI 审判", "释规", "自治"],
  },
  {
    topic: "长期判断与投资",
    question: "面对市场情绪、科技叙事和宏观判断，怎样减少拍脑袋？",
    detail:
      "讨论常用历史回溯、十年前观点校验、模型复盘等方式过滤噪声。重点不是喊单，而是把判断过程暴露出来接受校准。",
    tags: ["投资", "复盘", "模型"],
  },
  {
    topic: "生活经验互助",
    question: "严肃讨论之外，普通人的日常问题如何被认真对待？",
    detail:
      "租房、减肥、工具使用、学习路径和工作焦虑也会被拆解。宏大议题和生活细节并置，是这个群很有烟火气的一面。",
    tags: ["生活", "互助", "工具"],
  },
];

const valuePoints = [
  {
    title: "信息增量优先",
    text: "不追求单纯热闹，更看重资料、事实、解释框架和能被复用的判断方法。",
  },
  {
    title: "证据链约束",
    text: "争议观点需要说明来源、数据可靠性和推理路径。观点可以锋利，但不能只靠情绪推进。",
  },
  {
    title: "AI 参与治理",
    text: "AI 不只是聊天工具，也参与概念校准、审判辅助和资料整理；它的误判与边界同样会被讨论。",
  },
  {
    title: "成文规则自治",
    text: "群规、释规案例和变更记录公开维护。争议会沉淀成规则，而不是只留在口头印象里。",
  },
];

const ruleCards = [
  {
    title: "AI 审判",
    text: "任意群友可发起审判，由多款 AI 结合上下文与群规判断是否违规；结论不一致时，以对被裁定者最有利的结果为准。",
  },
  {
    title: "管理员执行",
    text: "群管依据 AI 判定发出警告并执行；不执行或降级需要给出理由，并承担对应的执行责任。",
  },
  {
    title: "警告系统",
    text: "警告默认 24 小时有效，明确告知后最长 7 天；累计 3 次后移出群聊，30天内累计警告Top3 用户新增违规默认加重。",
  },
  {
    title: "讨论秩序",
    text: "谁主张谁举证，就事论事，不用立场替代论证，不用阴阳怪气、人身攻击或隐私暴露破坏讨论质量。",
  },
];

const honorTiers = [
  {
    title: "歌颂者",
    amount: "5 元/月",
    privilege: "发电期间进入白名单，不会因长时间未发言被移出群聊。",
  },
  {
    title: "祈光人",
    amount: "10 元/月",
    privilege: "每月一次免费 @ 睡前消息编辑机会。",
  },
  {
    title: "太阳神官",
    amount: "20 元/月",
    privilege: "发电期间每月可任选 1 天成为管理员。",
  },
  {
    title: "光之祭司",
    amount: "30 元/月",
    privilege: "可提出修规建议，群主需在群内公开答复可或不可原因。",
  },
  {
    title: "无暗者",
    amount: "50 元/月",
    privilege: "每自然月有一次机会重置任一用户的全量违规记录。",
  },
];

const supporterGroups = [
  {
    tier: "无暗者",
    names: ["贝****", "卧*******", "大*", "买*******"],
  },
  {
    tier: "光之祭司",
    names: ["短*******", "魂*****"],
  },
  {
    tier: "太阳神官",
    names: ["黑**"],
  },
  {
    tier: "祈光人",
    names: ["马**"],
  },
  {
    tier: "歌颂者",
    names: [
      "督********",
      "爱发电用户_高*\*\**",
      "爱发电用户_f1436",
      "阿*",
      "L***",
      "爱发电用户_4f2e4",
      "爱发电用户_9d2f3",
      "爱发电用户_d796f",
      "a********",
      "n*******",
      "远**",
      "叶***",
      "海*",
    ],
  },
];

const supporterThanks = supporterGroups.flatMap((group) =>
  group.names.map((name) => ({ name, tier: group.tier })),
);

const rollingSupporters = [...supporterThanks, ...supporterThanks];

const culturePoints = [
  {
    title: "高信息密度",
    text: "话题从 AI、产业、投资、社会政策延伸到生活经验，重点不是热闹，而是能否提供增量信息。",
  },
  {
    title: "较真但可修正",
    text: "群规会在争议里补充释义、形成判例并进入版本记录，规则不是口头传统，而是持续维护的成文法。",
  },
  {
    title: "戏谑自有边界",
    text: "内部梗和自嘲可以存在，但笑点不能建立在人身攻击、恶意扭曲或暴露隐私之上。",
  },
  {
    title: "AI 深度参与",
    text: "AI 既是讨论工具，也是治理辅助工具；群内会认真讨论它的能力、误判、成本和执行边界。",
  },
];

const linkGroups = [
  {
    label: "GitHub 仓库",
    href: repoUrl,
    description: "查看源码、群规和变更历史",
  },
  {
    label: "群规原文",
    href: ruleSourceUrl,
    description: "GitHub 上的原始文档",
  },
  {
    label: "释规案例库",
    href: casesUrl,
    description: "浏览规则解释与边界案例",
  },
  {
    label: "常用话术配置",
    href: speechTemplateSourceUrl,
    description: "查看管理员可复制话术模板",
  },
  {
    label: "群规变更记录",
    href: changelogUrl,
    description: "追踪群规演进",
  },
  {
    label: "爱发电赞助计划",
    href: sponsorUrl,
    description: "支持 AI 判定与机器人维护",
  },
  { label: "收支明细", href: ledgerUrl, description: "查看充电与支出记录" },
  {
    label: "主流 AI 参考",
    href: aiRankingUrl,
    description: "审判中可用的候选模型列表与评分榜单",
  },
  {
    label: "机器人功能说明",
    href: botGuideUrl,
    description: "查看群聊机器人能力说明",
  },
];

const ruleStatusText = computed(() => {
  if (ruleStatus.value === "loading") return "正在读取 GitHub 最新群规";
  if (ruleStatus.value === "live")
    return `已读取 GitHub 记录，文档更新于${loadedAt.value ? `：${loadedAt.value}` : ""}`;
  return "GitHub 读取失败，正在显示本地快照";
});

const caseStatusText = computed(() => {
  if (caseStatus.value === "loading") return "正在读取 GitHub 释规记录";
  if (caseStatus.value === "live")
    return `已读取 GitHub 记录，文档更新于${casesLoadedAt.value ? `：${casesLoadedAt.value}` : ""}`;
  return "GitHub 读取失败，正在显示本地快照";
});

const speechTemplateStatusText = computed(() => {
  if (speechTemplateStatus.value === "loading")
    return "正在读取 GitHub 常用话术";
  if (speechTemplateStatus.value === "live")
    return `已读取 GitHub 记录，文档更新于${speechTemplatesLoadedAt.value ? `：${speechTemplatesLoadedAt.value}` : ""}`;
  return "GitHub 读取失败，正在显示本地快照";
});

const renderedRules = computed(() => renderMarkdown(ruleMarkdown.value));
const renderedCases = computed(() => renderMarkdown(caseMarkdown.value));

let activeSectionFrame = 0;

onMounted(() => {
  void loadRules();
  void loadCases();
  void loadSpeechTemplates();
  syncHeaderScrollOffset();
  window.addEventListener("scroll", requestActiveSectionUpdate, {
    passive: true,
  });
  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("hashchange", handleLocationHashChange);
  window.addEventListener("popstate", handleLocationHashChange);

  const initialTargetId = getHashTarget(window.location.hash);
  if (initialTargetId) {
    window.requestAnimationFrame(() =>
      scrollToSection(initialTargetId, "auto", false),
    );
  } else {
    requestActiveSectionUpdate();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", requestActiveSectionUpdate);
  window.removeEventListener("resize", handleWindowResize);
  window.removeEventListener("hashchange", handleLocationHashChange);
  window.removeEventListener("popstate", handleLocationHashChange);
  if (activeSectionFrame) {
    window.cancelAnimationFrame(activeSectionFrame);
  }
});

async function loadRules() {
  ruleStatus.value = "loading";
  ruleError.value = "";

  try {
    const response = await fetch(`${ruleRawUrl}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`GitHub Raw 返回 ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new Error("GitHub Raw 返回空内容");
    }

    ruleMarkdown.value = text;
    ruleStatus.value = "live";
    loadedAt.value = new Date().toLocaleString("zh-CN", { hour12: false });
  } catch (error) {
    ruleMarkdown.value = fallbackRules;
    ruleStatus.value = "fallback";
    ruleError.value = error instanceof Error ? error.message : "未知错误";
  }
}

async function loadCases() {
  caseStatus.value = "loading";
  caseError.value = "";

  try {
    const response = await fetch(`${caseRawUrl}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`GitHub Raw 返回 ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new Error("GitHub Raw 返回空内容");
    }

    caseMarkdown.value = text;
    caseStatus.value = "live";
    casesLoadedAt.value = new Date().toLocaleString("zh-CN", {
      hour12: false,
    });
  } catch (error) {
    caseMarkdown.value = fallbackCases;
    caseStatus.value = "fallback";
    caseError.value = error instanceof Error ? error.message : "未知错误";
  }
}

async function loadSpeechTemplates() {
  speechTemplateStatus.value = "loading";
  speechTemplateError.value = "";

  try {
    const response = await fetch(`${speechTemplateRawUrl}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`GitHub Raw 返回 ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new Error("GitHub Raw 返回空内容");
    }

    speechTemplates.value = parseSpeechTemplateConfig(text);
    speechTemplateStatus.value = "live";
    speechTemplatesLoadedAt.value = new Date().toLocaleString("zh-CN", {
      hour12: false,
    });
  } catch (error) {
    speechTemplates.value = parseSpeechTemplateConfig(fallbackSpeechTemplates);
    speechTemplateStatus.value = "fallback";
    speechTemplateError.value = error instanceof Error ? error.message : "未知错误";
  }
}

function handleInternalLinkClick(event: MouseEvent, href: string) {
  const targetId = getHashTarget(href);
  if (!targetId) return;

  event.preventDefault();
  scrollToSection(targetId);

  if (navItems.some((item) => item.id === targetId)) {
    activeSectionId.value = targetId;
  }
}

function handleLocationHashChange() {
  syncHeaderScrollOffset();
  const targetId = getHashTarget(window.location.hash);
  if (targetId) {
    scrollToSection(targetId, "smooth", false);
  }
  window.requestAnimationFrame(requestActiveSectionUpdate);
}

function handleWindowResize() {
  syncHeaderScrollOffset();
  requestActiveSectionUpdate();
}

function getHashTarget(href: string) {
  if (!href.startsWith("#")) return "";

  try {
    return decodeURIComponent(href.slice(1)) || "top";
  } catch {
    return href.slice(1) || "top";
  }
}

function scrollToSection(
  targetId: string,
  behavior: ScrollBehavior = "smooth",
  updateHash = true,
) {
  syncHeaderScrollOffset();

  const normalizedTargetId = targetId || "top";
  const target =
    normalizedTargetId === "top"
      ? document.getElementById("top")
      : document.getElementById(normalizedTargetId);

  if (!target) return;

  const targetTop =
    normalizedTargetId === "top"
      ? 0
      : window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();

  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior,
  });

  if (updateHash) {
    const nextHash = `#${normalizedTargetId}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }

  if (navItems.some((item) => item.id === normalizedTargetId)) {
    activeSectionId.value = normalizedTargetId;
  }
}

function syncHeaderScrollOffset() {
  document.documentElement.style.setProperty(
    "--header-scroll-offset",
    `${getHeaderOffset()}px`,
  );
}

function getHeaderOffset() {
  const header = document.querySelector<HTMLElement>(".site-header");
  return (header?.getBoundingClientRect().height ?? 0) + anchorScrollGap;
}

function requestActiveSectionUpdate() {
  if (activeSectionFrame) return;
  activeSectionFrame = window.requestAnimationFrame(updateActiveSection);
}

function updateActiveSection() {
  activeSectionFrame = 0;

  const headerOffset = getHeaderOffset();
  const activationLine =
    headerOffset + Math.min(160, window.innerHeight * 0.28);
  let currentSectionId = "";

  for (const item of navItems) {
    const section = document.getElementById(item.id);
    if (!section) continue;

    const rect = section.getBoundingClientRect();
    if (rect.top <= activationLine && rect.bottom > headerOffset) {
      currentSectionId = item.id;
    }
  }

  const isAtPageEnd =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;
  if (isAtPageEnd) {
    currentSectionId = navItems[navItems.length - 1]?.id ?? currentSectionId;
  }

  activeSectionId.value = currentSectionId;
}
</script>

<template>
  <span id="top"></span>
  <SiteHeader
    :nav-items="navItems"
    :active-section-id="activeSectionId"
    @navigate="handleInternalLinkClick"
  />

  <main>
    <HeroSection
      :hero-image="heroImage"
      :hero-actions="heroActions"
      :principles="principles"
      @navigate="handleInternalLinkClick"
    />
    <DiscussionSection :items="discussionHighlights" />
    <ValueSection :points="valuePoints" />
    <AboutSection :points="culturePoints" />
    <RulesOverviewSection :cards="ruleCards" />
    <RulesSection
      :rule-source-url="ruleSourceUrl"
      :rule-status="ruleStatus"
      :rule-status-text="ruleStatusText"
      :rule-error="ruleError"
      :rendered-rules="renderedRules"
      @reload="loadRules"
    />
    <CasesSection
      :case-status="caseStatus"
      :case-status-text="caseStatusText"
      :case-error="caseError"
      :cases-url="casesUrl"
      :rendered-cases="renderedCases"
      @reload="loadCases"
    />
    <SpeechTemplatesSection
      :template-config="speechTemplates"
      :template-status="speechTemplateStatus"
      :template-status-text="speechTemplateStatusText"
      :template-error="speechTemplateError"
      :template-source-url="speechTemplateSourceUrl"
      @reload="loadSpeechTemplates"
    />
    <HonorSection
      :sponsor-url="sponsorUrl"
      :ledger-url="ledgerUrl"
      :supporter-thanks="supporterThanks"
      :rolling-supporters="rollingSupporters"
      :sponsor-guide-image="sponsorGuideImage"
      :honor-tiers="honorTiers"
    />
    <LinksSection :links="linkGroups" />
  </main>

  <SiteFooter />
</template>
