import { Calendar, Clock, MapPin, User, Briefcase, Users, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DailyEffortDB } from '@/hooks/useDailyEfforts';
import { format, parseISO } from 'date-fns';

interface EffortViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  effort: DailyEffortDB | null;
}

export const EffortViewModal = ({ isOpen, onClose, effort }: EffortViewModalProps) => {
  if (!effort) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-border/50 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Effort Entry Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stakeholder Info */}
          <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/20 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-neon-blue/20">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{effort.stakeholder_name}</h3>
              <p className="text-sm text-muted-foreground">{effort.stakeholder_type}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label="Date"
              value={format(parseISO(effort.date), 'EEEE, MMMM dd, yyyy')}
            />
            <DetailItem
              icon={<Clock className="h-4 w-4" />}
              label="Effort Hours"
              value={`${effort.effort_hours} hours`}
            />
            {effort.session_start_time && effort.session_end_time && (
              <>
                <DetailItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Start Time"
                  value={effort.session_start_time}
                />
                <DetailItem
                  icon={<Clock className="h-4 w-4" />}
                  label="End Time"
                  value={effort.session_end_time}
                />
              </>
            )}
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Mode of Training"
              value={effort.mode_of_training === 'in-person' ? 'In-Person' : 'Virtual'}
            />
            {effort.active_genc_count && (
              <DetailItem
                icon={<Users className="h-4 w-4" />}
                label="Active GenC Count"
                value={effort.active_genc_count.toString()}
              />
            )}
          </div>

          {/* Area of Work */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Area of Work
            </label>
            <p className="rounded-lg border border-border/50 bg-muted/20 p-3 text-foreground">
              {effort.area_of_work}
            </p>
          </div>

          {/* Virtual Reason */}
          {effort.virtual_reason && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Reason for Virtual</label>
              <p className="rounded-lg border border-border/50 bg-muted/20 p-3 text-foreground">
                {effort.virtual_reason}
              </p>
            </div>
          )}

          {/* Notes */}
          {effort.notes && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Notes</label>
              <p className="rounded-lg border border-border/50 bg-muted/20 p-3 text-foreground">
                {effort.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
            <span>Created: {format(parseISO(effort.created_at), 'MMM dd, yyyy HH:mm')}</span>
            <span>Updated: {format(parseISO(effort.updated_at), 'MMM dd, yyyy HH:mm')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="space-y-1">
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      {icon}
      {label}
    </label>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);