import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, FlaskConical, CalendarDays, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'lab', label: 'Lab', icon: FlaskConical, path: '/?view=lab' },
  { id: 'task', label: 'Tasks', icon: LayoutGrid, path: '/?view=task' },
  { id: 'day', label: 'Day', icon: CalendarDays, path: '/?view=day' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = getActiveTab(location);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-3xl border-t border-white/10 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full rounded-xl transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-colors duration-200",
                isActive && "bg-white/10"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest transition-all duration-200",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function getActiveTab(location: { pathname: string; search: string }): string {
  if (location.pathname === '/analytics') return 'analytics';
  if (location.pathname === '/settings') return 'settings';
  if (location.pathname === '/') {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');
    if (view === 'lab') return 'lab';
    if (view === 'day') return 'day';
    return 'task';
  }
  return 'task';
}
