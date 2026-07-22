// 站点级单一数据源：所有组件从这里取配置，避免散落字面量
export interface NavItem {
  id: string;
  label: string;
}

export interface ContactCard {
  platform: string;
  name: string;
  detail: string;
  href: string;
  copy: boolean;
}

export const site = {
  name: 'Valkjin',
  github: 'Chaniug',
  role: '开发者 · 广告过滤与自动化',
  location: 'China · UTC+8',
  description:
    '专注广告过滤规则管理与自动化工具链的开发者。用 Python 与 TypeScript 构建可维护的工程，把繁琐留给脚本，把时间留给创造。',
  nav: [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'stats', label: 'Stats' },
    { id: 'journey', label: 'Journey' },
    { id: 'contact', label: 'Contact' },
  ] as NavItem[],
  contacts: [
    {
      platform: 'web',
      name: '个人主页',
      detail: 'Chaniug.github.io/chaniugv2',
      href: 'https://Chaniug.github.io/chaniugv2/',
      copy: false,
    },
    {
      platform: 'x',
      name: 'X (Twitter)',
      detail: '@valkjin',
      href: 'https://x.com/valkjin',
      copy: false,
    },
    {
      platform: 'tg',
      name: 'Telegram',
      detail: '@valkjin',
      href: 'https://t.me/valkjin',
      copy: false,
    },
    {
      platform: 'wechat',
      name: '微信',
      detail: 'valkjin',
      href: '#',
      copy: true,
    },
    {
      platform: 'qq',
      name: 'QQ',
      detail: '1247903536',
      href: '#',
      copy: true,
    },
    {
      platform: 'email',
      name: '邮箱',
      detail: 'you@example.com',
      href: 'mailto:you@example.com',
      copy: true,
    },
    {
      platform: 'github',
      name: 'GitHub',
      detail: '@Chaniug',
      href: 'https://github.com/Chaniug',
      copy: false,
    },
  ] as ContactCard[],
  stats: {
    commits: 2138,
    stars: 47,
    repos: 28,
    years: 4,
  },
};
