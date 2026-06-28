<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import fallbackRules from "../群组文档/rule.md?raw";
import heroImage from "./assets/hero.png";
import sponsorGuideImage from "./assets/爱发电权益说明.jpg";

type RuleStatus = "loading" | "live" | "fallback";

const repoUrl = "https://github.com/YaoZeyuan/bedtime-news-group-rules";
const encodedRulePath = "%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/rule.md";
const encodedCasePath =
  "%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/%E9%87%8A%E8%A7%84%E6%A1%88%E4%BE%8B%E5%BA%93/case-database.md";
const ruleRawUrl = `https://raw.githubusercontent.com/YaoZeyuan/bedtime-news-group-rules/main/${encodedRulePath}`;
const ruleSourceUrl = `${repoUrl}/blob/main/${encodedRulePath}`;
const changelogUrl = `${repoUrl}/blob/main/%E7%BE%A4%E7%BB%84%E6%96%87%E6%A1%A3/changelog.md`;
const casesUrl = `${repoUrl}/blob/main/${encodedCasePath}`;
const sponsorUrl = "https://ifdian.net/a/bedtime-news-group/plan";
const ledgerUrl = "https://docs.qq.com/space/DY3J6YnhJRGttTGJM";
const aiRankingUrl = "http://t.cn/AXbn82u3";
const botGuideUrl = "https://bit.ly/43SVCsW";

const ruleMarkdown = ref(fallbackRules);
const ruleStatus = ref<RuleStatus>("loading");
const ruleError = ref("");
const loadedAt = ref("");

const heroActions = [
  { label: "围观讨论现场", href: "#field-notes" },
  { label: "我们看重什么", href: "#why-follow" },
  { label: "群规全文", href: "#rules" },
  { label: "资料导航", href: "#links" },
];

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

const cases = [
  {
    title: "避免 troll 的适用规则",
    text: "厘清转发、举证、外部截图与不避 AI 条款的边界。",
  },
  {
    title: "Top3 警告的使用方法",
    text: "说明 Top3 统计、告知义务、有效期和动态调整方式。",
  },
  {
    title: "三法司会审",
    text: "当多个 AI 判定不一时，采用对被裁定者最有利结果的执行细则。",
  },
];

const changelogItems = [
  {
    version: "1.3.2",
    date: "2026-06-27",
    text: "审判中增加联系上下文策略，统一部分豁免场景，降低调侃误判。",
  },
  {
    version: "1.3.1",
    date: "2026-06-07",
    text: "明确连续发言大于等于 7 条后的口头警告与正式警告流程。",
  },
  {
    version: "1.3.0",
    date: "2026-06-06",
    text: "增加以身作则原则、禁止刷屏规则，并将释规文档迁移至 GitHub。",
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

const renderedRules = computed(() => renderMarkdown(ruleMarkdown.value));

onMounted(() => {
  void loadRules();
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

function renderMarkdown(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let tableRows: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${paragraph.map(renderInline).join("<br>")}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const closeTable = () => {
    if (tableRows.length === 0) return;
    html.push(renderTable(tableRows));
    tableRows = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (isTableLine(trimmed)) {
      closeParagraph();
      closeList();
      tableRows.push(trimmed);
      continue;
    }

    closeTable();

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      closeParagraph();
      closeList();
      html.push("<hr>");
      continue;
    }

    const quote = trimmed.match(/^>\s?(.+)$/);
    if (quote) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      closeParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${renderInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      closeParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();
  closeTable();

  return html.join("");
}

function renderInline(value: string) {
  const tokens: string[] = [];
  const saveToken = (html: string) => {
    const id = tokens.push(html) - 1;
    return `@@TOKEN_${id}@@`;
  };

  let output = value;
  output = output.replace(/`([^`]+)`/g, (_, code: string) =>
    saveToken(`<code>${escapeHtml(code)}</code>`),
  );
  output = output.replace(
    /\[([^\]]+)]\(([^)]+)\)/g,
    (_, label: string, href: string) => saveToken(renderAnchor(href, label)),
  );
  output = output.replace(/https?:\/\/[^\s<]+/g, (url) =>
    saveToken(renderAnchor(url, url)),
  );
  output = escapeHtml(output);
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return output.replace(
    /@@TOKEN_(\d+)@@/g,
    (_, id: string) => tokens[Number(id)] ?? "",
  );
}

function renderTable(rows: string[]) {
  const parsedRows = rows.map((row) =>
    row
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const bodyRows = parsedRows.filter(
    (row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)),
  );

  if (bodyRows.length === 0) return "";

  const [head, ...body] = bodyRows;
  const headHtml = head
    .map((cell) => `<th>${renderInline(cell)}</th>`)
    .join("");
  const bodyHtml = body
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  return `<div class="table-scroll"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function renderAnchor(href: string, label: string) {
  const safeHref = sanitizeHref(href);
  return `<a href="${safeHref}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function sanitizeHref(href: string) {
  const trimmed = href.trim();
  if (/^https?:\/\//.test(trimmed)) return escapeAttribute(trimmed);
  if (trimmed.startsWith("#")) return escapeAttribute(trimmed);
  return "#";
}

function isTableLine(line: string) {
  return line.startsWith("|") && line.endsWith("|") && line.includes("|");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
</script>

<template>
  <span id="top"></span>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="回到首页">
      <span class="brand-mark">睡前<br />消息</span>
      <span>睡前消息讨论组</span>
      <small>非官方</small>
    </a>

    <nav class="site-nav" aria-label="站内导航">
      <a href="#field-notes">讨论现场</a>
      <a href="#rules">规则全文</a>
      <a href="#honor">荣誉殿堂</a>
      <a href="#links">资料导航</a>
    </nav>
  </header>

  <main>
    <section class="hero-section">
      <img class="hero-art" :src="heroImage" alt="" aria-hidden="true" />
      <div class="section-inner hero-content">
        <p class="eyebrow">Unofficial Bedtime Group</p>
        <h1>睡前消息讨论组</h1>
        <p class="hero-copy">
          一个观众自发维护的非官方讨论组。这里用资料、逻辑、AI
          校准和成文规则，试图维护一个值得每日通读的小宇宙。
        </p>

        <div class="hero-actions" aria-label="主要入口">
          <a
            v-for="action in heroActions"
            :key="action.href"
            class="button button-primary"
            :href="action.href"
          >
            {{ action.label }}
          </a>
        </div>

        <dl class="principle-strip" aria-label="规则运行关键机制">
          <div v-for="item in principles" :key="item.label">
            <dt>{{ item.value }}</dt>
            <dd>{{ item.label }}</dd>
          </div>
        </dl>
      </div>
    </section>

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
          <article
            v-for="item in discussionHighlights"
            :key="item.topic"
            class="discussion-card"
          >
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
          <article
            v-for="point in valuePoints"
            :key="point.title"
            class="value-card"
          >
            <h3>{{ point.title }}</h3>
            <p>{{ point.text }}</p>
          </article>
        </div>
      </div>
    </section>

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
          <article
            v-for="point in culturePoints"
            :key="point.title"
            class="culture-card"
          >
            <h3>{{ point.title }}</h3>
            <p>{{ point.text }}</p>
          </article>
        </div>
      </div>
    </section>

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
          <article
            v-for="card in ruleCards"
            :key="card.title"
            class="rule-card"
          >
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
          </article>
        </div>
      </div>
    </section>

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
            <button class="button" type="button" @click="loadRules">
              重新读取
            </button>
            <a
              class="button"
              :href="ruleSourceUrl"
              target="_blank"
              rel="noreferrer"
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

    <section id="cases" class="section cases-section">
      <div class="section-inner two-column">
        <div>
          <div class="section-heading compact-heading">
            <p class="eyebrow">Case Law</p>
            <h2>释规案例库</h2>
            <p>
              释规用于解释边界案例，帮助群管和群友理解“这条规则到底怎么用”。
            </p>
          </div>

          <div class="case-list">
            <article v-for="item in cases" :key="item.title" class="case-card">
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>

          <a
            class="button button-primary"
            :href="casesUrl"
            target="_blank"
            rel="noreferrer"
            >查看完整释规</a
          >
        </div>

        <div id="changelog">
          <div class="section-heading compact-heading">
            <p class="eyebrow">Changelog</p>
            <h2>变更记录</h2>
            <p>群规通过 Git 持续演进，重大调整会进入版本记录。</p>
          </div>

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
    </section>

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
              <a
                class="button"
                :href="ledgerUrl"
                target="_blank"
                rel="noreferrer"
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
          <article
            v-for="tier in honorTiers"
            :key="tier.title"
            class="tier-card"
          >
            <div>
              <h3>{{ tier.title }}</h3>
              <p class="tier-amount">{{ tier.amount }}</p>
            </div>
            <p>{{ tier.privilege }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="links" class="section links-section">
      <div class="section-inner">
        <div class="section-heading compact-heading">
          <p class="eyebrow">Public Entries</p>
          <h2>公开入口</h2>
          <p>可以从这里查看群组公开资料、赞助计划、收支明细与工具说明。</p>
        </div>

        <div class="link-grid">
          <a
            v-for="link in linkGroups"
            :key="link.href"
            class="link-card"
            :href="link.href"
            target="_blank"
            rel="noreferrer"
          >
            <span>{{ link.label }}</span>
            <small>{{ link.description }}</small>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="section-inner">
      <p>注意：本站为非官方讨论组，与《睡前消息》节目官方并无组织关联。</p>
    </div>
  </footer>
</template>
