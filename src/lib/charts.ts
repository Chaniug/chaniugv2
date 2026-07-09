// 本地轻量图表：纯 SVG 字符串生成，替代 github-readme-stats / summary-cards 等外链图片。
// 所有输入均来自受控数据（GitHub API 或 fallback），无外部注入风险。

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Astro: '#ff5d01',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Rust: '#dea584',
  Go: '#00ADD8',
  C: '#555555',
  'C++': '#f34b7d',
  Vue: '#41b883',
  Java: '#b07219',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
};

export function langColor(name: string): string {
  return LANG_COLORS[name] || '#8b9bb4';
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

/** 环形图（甜甜圈）：返回完整 <svg> 字符串，中心显示总数与标题。 */
export function donutChart(
  slices: DonutSlice[],
  opts: { size?: number; thickness?: number; centerTitle?: string; centerValue?: string } = {}
): string {
  const size = opts.size ?? 200;
  const thickness = opts.thickness ?? 22;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const segs = slices
    .map((s) => {
      const len = (s.value / total) * circ;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}" stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})" />`;
      offset += len;
      return seg;
    })
    .join('');
  const title = opts.centerTitle ? `<text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="11" font-family="monospace">${esc(opts.centerTitle)}</text>` : '';
  const value = opts.centerValue ? `<text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="20" font-weight="700">${esc(opts.centerValue)}</text>` : '';
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="语言分布环形图">${segs}${title}${value}</svg>`;
}

/** 横向条形列表：用于「星标排行」等。 */
export function barList(
  items: { label: string; value: number; color: string }[],
  opts: { max?: number; unit?: string } = {}
): string {
  const max = opts.max ?? Math.max(...items.map((i) => i.value), 1);
  const w = 320;
  const rowH = 30;
  const gap = 10;
  const labelW = 96;
  const valW = 42;
  const barW = w - labelW - valW;
  const h = items.length * (rowH + gap);
  const rows = items
    .map((it, i) => {
      const y = i * (rowH + gap);
      const bw = Math.max(2, (it.value / max) * barW);
      return `
        <text x="0" y="${y + rowH / 2 + 4}" fill="rgba(255,255,255,0.8)" font-size="12" font-family="monospace">${esc(it.label.slice(0, 12))}</text>
        <rect x="${labelW}" y="${y + 4}" width="${barW}" height="${rowH - 8}" rx="5" fill="rgba(255,255,255,0.06)" />
        <rect x="${labelW}" y="${y + 4}" width="${bw.toFixed(1)}" height="${rowH - 8}" rx="5" fill="${it.color}">
          <title>${esc(it.label)}: ${it.value}${opts.unit || ''}</title>
        </rect>
        <text x="${w - valW + 6}" y="${y + rowH / 2 + 4}" fill="rgba(255,255,255,0.6)" font-size="12" font-family="monospace">${it.value}${opts.unit || ''}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="条形图">${rows}</svg>`;
}

/** 概览小方块（仓库数/星标等统计瓷砖）。 */
export function statTiles(tiles: { label: string; value: string }[]): string {
  return tiles
    .map(
      (t) =>
        `<div class="gh-tile"><span class="gh-tile-v">${esc(t.value)}</span><span class="gh-tile-l">${esc(t.label)}</span></div>`
    )
    .join('');
}
