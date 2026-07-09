// 成长历程单一数据源：横向时间轴（phase C 横向展示风格）
export interface Milestone {
  year: string;
  title: string;
  desc: string;
  tag: string;
}

export const journey: Milestone[] = [
  {
    year: '2021',
    title: '初次触电代码',
    desc: '从 HTML / CSS 起步，搭建人生第一个个人博客，被“所见即所得”的魔力吸引。',
    tag: 'Start',
  },
  {
    year: '2022',
    title: '自动化觉醒',
    desc: '用脚本批量处理重复工作，第一次体会到“让机器替我干活”的爽感。',
    tag: 'Automation',
  },
  {
    year: '2023',
    title: '开源贡献',
    desc: '发布 FilterFusion、AdSuper 等广告过滤与规则管理工具，服务众多用户。',
    tag: 'Open Source',
  },
  {
    year: '2024',
    title: '拥抱 AI',
    desc: '接入大模型，构建支持多模型的 Buddy 客户端，把 AI 变成日常生产力。',
    tag: 'AI',
  },
  {
    year: '2025',
    title: 'IPTV 聚合',
    desc: '自动化聚合高质量中文 IPTV 源，探索流媒体与订阅工程的边界。',
    tag: 'Streaming',
  },
  {
    year: '2026',
    title: 'chaniugv2',
    desc: '用 Astro 重构个人主页：星空粒子、技能星图、横向叙事，重新定义“酷”。',
    tag: 'Now',
  },
];
