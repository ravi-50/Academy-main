import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, Edit2, Eye, Trash2, MoreVertical } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DailyEffortDB } from '@/hooks/useDailyEfforts';
import { format, parseISO } from 'date-fns';

interface EffortEntryCardProps {
  effort: DailyEffortDB;
  onEdit: (effort: DailyEffortDB) => void;
  onView: (effort: DailyEffortDB) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const stakeholderColors: Record<string, string> = {
  'Technical Trainer': 'from-primary/20 to-neon-blue/20 text-primary',
  'Behavioral Trainer': 'from-secondary/20 to-neon-purple/20 text-secondary',
  'Mentor': 'from-success/20 to-success/10 text-success',
  'Buddy Mentor': 'from-warning/20 to-warning/10 text-warning',
};

export const EffortEntryCard = ({ effort, onEdit, onView, onDelete, index = 0 }: EffortEntryCardProps) => {
  const colorClass = stakeholderColors[effort.stakeholder_type] || 'from-muted/20 to-muted/10 text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <GlassCard variant="hover" className="p-4 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass}`}>
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground truncate">{effort.stakeholder_name}</h4>
                <span className="flex-shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {effort.stakeholder_type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {effort.area_of_work}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(parseISO(effort.date), 'MMM dd, yyyy')}
                </span>
                {effort.session_start_time && effort.session_end_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {effort.session_start_time} - {effort.session_end_time}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {effort.mode_of_training === 'in-person' ? 'In-Person' : 'Virtual'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">{effort.effort_hours}</p>
              <p className="text-xs text-muted-foreground">hours</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 border-border/50 bg-background/95 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => onView(effort)} className="cursor-pointer gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(effort)} className="cursor-pointer gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(effort.id)} 
                  className="cursor-pointer gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {effort.virtual_reason && (
          <div className="mt-3 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium">Virtual Reason:</span> {effort.virtual_reason}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};