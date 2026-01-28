import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Mail,
  Save,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'system';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'system', label: 'System', icon: Database },
];

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and system preferences
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </GlassCard>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3"
        >
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'system' && <SystemSettings />}
        </motion.div>
      </div>
    </div>
  );
};

const ProfileSettings = () => (
  <GlassCard className="p-6">
    <h2 className="mb-6 text-xl font-semibold text-foreground">Profile Settings</h2>
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-neon-purple text-2xl font-bold text-secondary-foreground">
          JA
        </div>
        <div>
          <GradientButton variant="outline" size="sm">
            Change Avatar
          </GradientButton>
          <p className="mt-2 text-xs text-muted-foreground">
            JPG, PNG or GIF. Max size 2MB
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input
            type="text"
            defaultValue="John Administrator"
            className="input-premium w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            defaultValue="admin@company.com"
            className="input-premium w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Role</label>
          <input
            type="text"
            defaultValue="System Administrator"
            disabled
            className="input-premium w-full opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <input
            type="text"
            defaultValue="Bangalore, India"
            className="input-premium w-full"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <GradientButton variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Changes
        </GradientButton>
      </div>
    </div>
  </GlassCard>
);

const NotificationSettings = () => (
  <GlassCard className="p-6">
    <h2 className="mb-6 text-xl font-semibold text-foreground">Notification Preferences</h2>
    <div className="space-y-6">
      {[
        { label: 'Daily effort reminders', description: 'Get reminded to log daily efforts' },
        { label: 'Weekly submission alerts', description: 'Notifications for Friday submissions' },
        { label: 'New cohort assignments', description: 'When new cohorts are assigned to you' },
        { label: 'Report generation', description: 'When reports are ready for download' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-foreground after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full" />
          </label>
        </div>
      ))}
    </div>
  </GlassCard>
);

const SecuritySettings = () => (
  <GlassCard className="p-6">
    <h2 className="mb-6 text-xl font-semibold text-foreground">Security Settings</h2>
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Current Password</label>
        <input type="password" className="input-premium w-full" placeholder="••••••••" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">New Password</label>
          <input type="password" className="input-premium w-full" placeholder="••••••••" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <input type="password" className="input-premium w-full" placeholder="••••••••" />
        </div>
      </div>
      <div className="flex justify-end">
        <GradientButton variant="primary" icon={<Shield className="h-4 w-4" />}>
          Update Password
        </GradientButton>
      </div>
    </div>
  </GlassCard>
);

const SystemSettings = () => (
  <GlassCard className="p-6">
    <h2 className="mb-6 text-xl font-semibold text-foreground">System Configuration</h2>
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Default Location</label>
          <select className="input-premium w-full">
            <option>Bangalore</option>
            <option>Chennai</option>
            <option>Hyderabad</option>
            <option>Pune</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Time Zone</label>
          <select className="input-premium w-full">
            <option>Asia/Kolkata (IST)</option>
            <option>America/New_York (EST)</option>
            <option>Europe/London (GMT)</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm text-warning">
          Changes to system settings will affect all users. Please proceed with caution.
        </p>
      </div>
      <div className="flex justify-end">
        <GradientButton variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Configuration
        </GradientButton>
      </div>
    </div>
  </GlassCard>
);
