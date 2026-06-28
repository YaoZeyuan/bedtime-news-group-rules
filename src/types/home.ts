export type RuleStatus = "loading" | "live" | "fallback";

export type NavItem = {
  label: string;
  id: string;
};

export type HeroAction = {
  label: string;
  href: string;
};

export type Principle = {
  value: string;
  label: string;
};

export type DiscussionHighlight = {
  topic: string;
  question: string;
  detail: string;
  tags: string[];
};

export type ValuePoint = {
  title: string;
  text: string;
};

export type RuleCard = {
  title: string;
  text: string;
};

export type CulturePoint = {
  title: string;
  text: string;
};

export type HonorTier = {
  title: string;
  amount: string;
  privilege: string;
};

export type Supporter = {
  name: string;
  tier: string;
};

export type LinkGroup = {
  label: string;
  href: string;
  description: string;
};
