import { Button } from "@/components/ui/button";
import KeyStringForm from "../key-string-form";
import { JSONValue, OpeningSymbol, Primitive } from "../types";
import parseValueIntoString from "../utils/parse-value-into-string";
import { ChevronRight } from "lucide-react";
import ActionsContainer from "./actions-container";

interface OpeningSymbolContainerProps {
    keyString?: string;
    unflattenedValue?: JSONValue;
    numberOfChildren?: number;
    openingSymbol: OpeningSymbol;
    collapsed?: boolean;
    canExpand?: boolean;
    onToggleExpand?: () => void;
    isEditing?: boolean;
    onEditStart?: () => void;
    onEdit?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: Primitive;
    }) => void;
    isAdding?: boolean;
    onAddStart?: () => void;
    onAdd?: ({
        updatedKey,
        updatedValue,
    }: {
        updatedKey: string;
        updatedValue: Primitive;
    }) => void;
    onDelete?: () => void;
    onCancel?: () => void;
}

export default function OpeningSymbolContainer({
    keyString,
    unflattenedValue,
    numberOfChildren,
    openingSymbol,
    collapsed,
    canExpand,
    onToggleExpand,
    isEditing,
    onEditStart,
    onEdit,
    isAdding,
    onAddStart,
    onAdd,
    onDelete,
    onCancel,
}: OpeningSymbolContainerProps) {
    if (isEditing) {
        return (
            <KeyStringForm
                keyString={keyString ?? ""}
                value={parseValueIntoString(unflattenedValue)}
                editableKey={(keyString ?? "").length > 0}
                onSubmit={onEdit}
                onCancel={onCancel}
            />
        );
    }

    return (
        <div className="group relative flex flex-row gap-2">
            {canExpand && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-8 h-6 w-6"
                    onClick={onToggleExpand}
                >
                    <ChevronRight />
                </Button>
            )}
            <div className="flex flex-col">
                <pre className="font-bold">
                    {keyString && `${keyString}: `}
                    {openingSymbol}
                    {collapsed && (
                        <>
                            <span className="mx-2 italic text-muted-foreground">
                                {numberOfChildren}{" "}
                                {numberOfChildren === 1 ? "item" : "items"}
                            </span>
                            {getClosingSymbol(openingSymbol)}
                        </>
                    )}
                </pre>
                {isAdding && (
                    <KeyStringForm
                        keyString={openingSymbol === "{" ? "" : "0"}
                        value={""}
                        editableKey={openingSymbol === "{"}
                        onSubmit={onAdd}
                        onCancel={onCancel}
                    />
                )}
            </div>
            {!isAdding && (
                <div className="invisible group-hover:visible">
                    <ActionsContainer
                        onAdd={onAddStart}
                        onEdit={onEditStart}
                        onDelete={onDelete}
                    />
                </div>
            )}
        </div>
    );
}

function getClosingSymbol(openingSymbol: "{" | "[") {
    if (openingSymbol === "{") {
        return "}";
    } else {
        return "]";
    }
}
