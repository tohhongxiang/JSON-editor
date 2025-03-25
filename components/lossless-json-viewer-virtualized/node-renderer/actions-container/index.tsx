import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Pencil, Plus, Trash } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface ActionsContainerProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onAdd?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
}

export default function ActionsContainer({
    onAdd,
    onEdit,
    onDelete,
    onCopy,
    ...props
}: ActionsContainerProps) {
    return (
        <div {...props} className={cn("flex flex-row gap-1", props.className)}>
            {onAdd && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onAdd}
                >
                    <Plus />
                </Button>
            )}
            {onEdit && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onEdit}
                >
                    <Pencil />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onDelete}
                >
                    <Trash />
                </Button>
            )}
            {onCopy && (
                <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onCopy}
                >
                    <Copy />
                </Button>
            )}
        </div>
    );
}
