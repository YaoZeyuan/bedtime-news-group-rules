import type {
  SpeechTemplateCase,
  SpeechTemplateConfig,
  SpeechTemplateGroup,
  SpeechTemplateMessage,
} from "../types/home";

export function parseSpeechTemplateConfig(
  source: string,
): SpeechTemplateConfig {
  const parsed: unknown = JSON.parse(source);
  if (!isRecord(parsed) || !Array.isArray(parsed.groups)) {
    throw new Error("话术配置缺少 groups 数组");
  }

  return {
    groups: parsed.groups.map(parseGroup),
  };
}

function parseGroup(value: unknown): SpeechTemplateGroup {
  if (!isRecord(value) || !Array.isArray(value.cases)) {
    throw new Error("话术分组配置不完整");
  }

  return {
    id: readString(value, "id"),
    title: readString(value, "title"),
    description: readOptionalString(value, "description"),
    cases: value.cases.map(parseCase),
  };
}

function parseCase(value: unknown): SpeechTemplateCase {
  if (!isRecord(value) || !Array.isArray(value.messages)) {
    throw new Error("话术 case 配置不完整");
  }

  return {
    id: readString(value, "id"),
    title: readString(value, "title"),
    description: readOptionalString(value, "description"),
    messages: value.messages.map(parseMessage),
  };
}

function parseMessage(value: unknown): SpeechTemplateMessage {
  if (!isRecord(value)) {
    throw new Error("话术条目配置不完整");
  }

  return {
    id: readString(value, "id"),
    title: readString(value, "title"),
    text: readString(value, "text"),
  };
}

function readString(value: Record<string, unknown>, key: string) {
  const field = value[key];
  if (typeof field !== "string" || !field.trim()) {
    throw new Error(`话术配置字段 ${key} 不能为空`);
  }

  return field;
}

function readOptionalString(value: Record<string, unknown>, key: string) {
  const field = value[key];
  if (field === undefined) return undefined;
  if (typeof field !== "string") {
    throw new Error(`话术配置字段 ${key} 必须是字符串`);
  }

  return field;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
