import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useEffect } from "react";

interface SearchBoxProps {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    value?: string;
    onValueChange?: (value: string) => void;
    numberOfResults?: number;
    highlightedResultIndex?: number;
    onGoToNextResult?: () => void;
    onGoToPreviousResult?: () => void;
}

export default function SearchBox({
    isOpen,
    onOpenChange,
    value,
    onValueChange,
    numberOfResults = 0,
    highlightedResultIndex = -1,
    onGoToNextResult,
    onGoToPreviousResult,
}: SearchBoxProps) {
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange?.(!isOpen);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [isOpen, onOpenChange]);

    if (!isOpen) {
        return (
            <Button
                className="absolute right-2 top-0 z-10"
                variant="secondary"
                onClick={() => onOpenChange?.(true)}
            >
                <Search />
                <kbd className="rounded-md border px-1">Ctrl/⌘-K</kbd>
            </Button>
        );
    }

    return (
        <div className="absolute right-2 top-0 z-10 flex flex-row items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 pr-0">
            <Input
                placeholder="Search"
                value={value}
                onChange={(e) => onValueChange?.(e.target.value)}
            />
            {(value ?? "").length > 0 && (
                <div>
                    <p className="font-light text-muted-foreground">
                        {numberOfResults === 0
                            ? `0/0`
                            : `${highlightedResultIndex + 1}/${numberOfResults}`}
                    </p>
                </div>
            )}
            <div className="flex flex-row">
                <Button variant="ghost" onClick={onGoToPreviousResult}>
                    <ChevronUp />
                </Button>
                <Button variant="ghost" onClick={onGoToNextResult}>
                    <ChevronDown />
                </Button>
                <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
                    <X />
                </Button>
            </div>
        </div>
    );
}
