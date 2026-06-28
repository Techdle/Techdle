import { Theme } from '@/components/ThemeProvider';
import { Moon, Sun, Monitor, Wind, TreePine, Zap, Radio, Waves, Sunrise, MoonStar, type LucideIcon } from 'lucide-react';

export interface ThemeMeta {
  id: Theme;
  name: string;
  description: string;
  mode: 'DARK' | 'LIGHT';
  icon: LucideIcon;
  colors: {
    primary: string;
    background: string;
    surface: string;
  };
}

export const themes: ThemeMeta[] = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Clean & simple',
    mode: 'DARK',
    icon: Moon,
    colors: { primary: '#3b82f6', background: '#020617', surface: '#0f172a' },
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean & bright',
    mode: 'LIGHT',
    icon: Sun,
    colors: { primary: '#3b82f6', background: '#f8fafc', surface: '#f1f5f9' },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic chill',
    mode: 'DARK',
    icon: Wind,
    colors: { primary: '#81a1c1', background: '#2e3440', surface: '#3b4252' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Nature green',
    mode: 'DARK',
    icon: TreePine,
    colors: { primary: '#4ade80', background: '#1c2e26', surface: '#2b4539' },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Maximum visibility',
    mode: 'DARK',
    icon: Monitor,
    colors: { primary: '#4499ff', background: '#000000', surface: '#111111' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon & grid',
    mode: 'DARK',
    icon: Zap,
    colors: { primary: '#ea3546', background: '#0d0221', surface: '#261447' },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Neon retro',
    mode: 'DARK',
    icon: Radio,
    colors: { primary: '#08f7fe', background: '#2b213a', surface: '#241b2f' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue',
    mode: 'DARK',
    icon: Waves,
    colors: { primary: '#26c6da', background: '#0f2027', surface: '#203a43' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange',
    mode: 'DARK',
    icon: Sunrise,
    colors: { primary: '#ff5722', background: '#2b1126', surface: '#42203b' },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Vampire chic',
    mode: 'DARK',
    icon: MoonStar,
    colors: { primary: '#ff79c6', background: '#282a36', surface: '#44475a' },
  },
];
