import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { GradientButton } from '@/components/ui/GradientButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTrainers } from '@/hooks/useTrainers';
import { useMentors } from '@/hooks/useMentors';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignStakeholderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (id: number) => void;
    type: 'trainer' | 'mentor';
    isLoading?: boolean;
    excludeIds?: number[];
}

export const AssignStakeholderModal = ({
    isOpen,
    onClose,
    onAssign,
    type,
    isLoading,
    excludeIds = [],
}: AssignStakeholderModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: trainers = [], isLoading: loadingTrainers } = useTrainers();
    const { data: mentors = [], isLoading: loadingMentors } = useMentors();

    const stakeholders = type === 'trainer' ? trainers : mentors;
    const filtered = stakeholders.filter(s =>
        !excludeIds.includes(s.id) &&
        s.status === 'ACTIVE' &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s as any).empId?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md border-border/50 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Assign Existing {type === 'trainer' ? 'Trainer' : 'Mentor'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${type}s...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                            {(loadingTrainers || loadingMentors) ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
                            ) : filtered.length === 0 ? (
                                <div className="py-8 text-center text-sm text-muted-foreground">No {type}s found</div>
                            ) : (
                                filtered.map((s) => (
                                    <GlassCard
                                        key={s.id}
                                        variant="hover"
                                        className="flex cursor-pointer items-center justify-between p-3"
                                        onClick={() => onAssign(s.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                                                {s.avatar_url ? (
                                                    <img src={s.avatar_url} alt={s.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    s.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{s.name}</p>
                                                <p className="text-xs text-muted-foreground">{s.email}</p>
                                            </div>
                                        </div>
                                        <UserPlus className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                                    </GlassCard>
                                ))
                            )}
                        </div>
                    </ScrollArea>

                    <div className="flex justify-end pt-2">
                        <GradientButton variant="ghost" onClick={onClose}>
                            Cancel
                        </GradientButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
