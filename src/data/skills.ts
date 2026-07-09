// 技能星图节点数据。icon 为 public/ 下相对路径；内联节点用 'inline:*' 标记，由组件特殊处理。
export type SkillCategory = 'lang' | 'fe' | 'be' | 'devops' | 'ai';

export interface Skill {
  name: string;
  category: SkillCategory;
  // public/img 下路径，或 inline 标记
  icon: string;
}

export const categoryColor: Record<SkillCategory, string> = {
  lang: '#4f8cff',
  fe: '#22d3ee',
  be: '#a855f7',
  devops: '#c084fc',
  ai: '#22d3ee',
};

export const skills: Skill[] = [
  { name: 'JavaScript', category: 'lang', icon: 'img/icons/javascript.svg' },
  { name: 'TypeScript', category: 'lang', icon: 'img/icons/typescript.svg' },
  { name: 'Python', category: 'lang', icon: 'img/icons/python.svg' },
  { name: 'React', category: 'fe', icon: 'img/icons/react.svg' },
  { name: 'Vue', category: 'fe', icon: 'img/icons/vuedotjs.svg' },
  { name: 'Node.js', category: 'be', icon: 'img/icons/nodedotjs.svg' },
  { name: 'Docker', category: 'devops', icon: 'img/icons/docker.svg' },
  { name: 'Linux', category: 'devops', icon: 'img/icons/linux.svg' },
  { name: 'Git', category: 'devops', icon: 'img/icons/git.svg' },
  { name: 'AI / LLM', category: 'ai', icon: 'inline:ai' },
  { name: 'GitHub', category: 'devops', icon: 'img/icons/github.svg' },
  { name: 'Java', category: 'lang', icon: 'img/icons/openjdk.svg' },
  { name: 'Windows', category: 'devops', icon: 'inline:windows' },
  { name: 'Rust', category: 'lang', icon: 'img/icons/rust.svg' },
];
