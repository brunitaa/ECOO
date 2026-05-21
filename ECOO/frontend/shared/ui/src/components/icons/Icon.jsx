import * as Lucide from 'lucide-react';

const ICON_MAP = {
  home: Lucide.Home,
  scan: Lucide.ScanLine,
  qr: Lucide.QrCode,
  gift: Lucide.Gift,
  logout: Lucide.LogOut,
  leaf: Lucide.Leaf,
  recycle: Lucide.Recycle,
  bike: Lucide.Bike,
  shopping: Lucide.ShoppingBag,
  check: Lucide.Check,
  x: Lucide.X,
  clock: Lucide.Clock,
  alert: Lucide.AlertCircle,
  info: Lucide.Info,
  chart: Lucide.BarChart3,
  trending: Lucide.TrendingUp,
  users: Lucide.Users,
  building: Lucide.Building2,
  shield: Lucide.Shield,
  zap: Lucide.Zap,
  globe: Lucide.Globe2,
  target: Lucide.Target,
  award: Lucide.Award,
  sparkles: Lucide.Sparkles,
  menu: Lucide.Menu,
  chevronLeft: Lucide.ChevronLeft,
  chevronRight: Lucide.ChevronRight,
  settings: Lucide.Settings,
  camera: Lucide.Camera,
  loader: Lucide.Loader2,
  plus: Lucide.Plus,
  download: Lucide.Download,
  external: Lucide.ExternalLink,
  book: Lucide.BookOpen,
  factory: Lucide.Factory,
  tree: Lucide.Trees,
  droplet: Lucide.Droplets,
  coin: Lucide.Coins,
  mail: Lucide.Mail,
  lock: Lucide.Lock,
  user: Lucide.User,
  play: Lucide.Play,
  pause: Lucide.Pause,
};

export const iconNames = Object.keys(ICON_MAP);

export default function Icon({ name, size = 20, strokeWidth = 2, className = '', ...props }) {
  const Cmp = ICON_MAP[name];
  if (!Cmp) return null;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      className={`ec-icon ${className}`.trim()}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    />
  );
}