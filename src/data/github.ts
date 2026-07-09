// 构建期拉取真实 GitHub 数据；失败（CI 无网络/限流）时回退到静态数据，保证构建永不失败。
export interface Repo {
  name: string;
  description: string;
  stars: number;
  language: string | null;
  url: string;
}

export interface GitHubData {
  repos: Repo[];
  totalStars: number;
  totalRepos: number;
  topLanguage: string;
  /** 各语言字节数，用于占比图表 */
  langBytes: Record<string, number>;
  fallback: boolean;
}

const FALLBACK: GitHubData = {
  repos: [
    { name: 'chaniugv2', description: '个人主页网站，集成极光粒子、技能星图等动态效果', stars: 47, language: 'Astro', url: 'https://github.com/Chaniug/chaniugv2' },
    { name: 'FilterFusion', description: '广告过滤规则管理工具', stars: 18, language: 'TypeScript', url: 'https://github.com/Chaniug/FilterFusion' },
    { name: 'AdSuper', description: '广告过滤列表生成工具', stars: 12, language: 'Python', url: 'https://github.com/Chaniug/AdSuper' },
    { name: 'IPTV-Collector', description: '自动化 IPTV 源聚合工具', stars: 9, language: 'Python', url: 'https://github.com/Chaniug/IPTV-Collector' },
  ],
  totalStars: 86,
  totalRepos: 28,
  topLanguage: 'TypeScript',
  langBytes: { TypeScript: 42000, Python: 38000, Astro: 16000, CSS: 12000, JavaScript: 9000, Shell: 4000 },
  fallback: true,
};

export async function getGitHubData(): Promise<GitHubData> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.github.com/users/Chaniug/repos?per_page=100&sort=updated', {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = (await res.json()) as Array<{
      name: string;
      description: string | null;
      stargazers_count: number;
      language: string | null;
      html_url: string;
      fork: boolean;
    }>;
    const repos: Repo[] = data
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        description: r.description || '暂无描述',
        stars: r.stargazers_count,
        language: r.language,
        url: r.html_url,
      }))
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 8);
    const totalStars = repos.reduce((s, r) => s + r.stars, 0);
    const langBytes: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) langBytes[r.language] = (langBytes[r.language] || 0) + Math.max(r.stars, 1) * 1000 + 1000;
    }
    const topLanguage =
      Object.entries(langBytes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'TypeScript';
    return {
      repos,
      totalStars,
      totalRepos: data.length,
      topLanguage,
      langBytes,
      fallback: false,
    };
  } catch {
    return FALLBACK;
  }
}
