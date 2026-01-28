import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
}

export const ActionMenu = ({
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = false,
}: ActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 border-border/50 bg-background/95 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {showView && onView && (
          <DropdownMenuItem
            onClick={onView}
            className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {showEdit && onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {showDelete && onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="cursor-pointer gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};