import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

export const UserDropdown = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-neon-purple text-sm font-semibold text-secondary-foreground">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium text-foreground">{user?.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-border/50 bg-background/95 backdrop-blur-xl"
        sideOffset={8}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
            {user?.role}
          </span>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleSettings}
          className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
        >
          <User className="h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSettings}
          className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={toggleTheme}
          className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};