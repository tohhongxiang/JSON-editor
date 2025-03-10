import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ClosingSymbol, JSONValue, OpeningSymbol, Primitive } from "../types";
import KeyStringForm from "../key-string-form";
import parseValueIntoString from "../utils/parse-value-into-string";
import ActionsContainer from "./actions-container";

interface EmptyContainerProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	keyString?: string;
	unflattenedValue: JSONValue;
	openingSymbol: OpeningSymbol;
	closingSymbol: ClosingSymbol;
	isAdding?: boolean;
	onAddStart?: () => void;
	onAdd?: ({
		updatedKey,
		updatedValue,
	}: {
		updatedKey: string;
		updatedValue: Primitive;
	}) => void;
	isEditing?: boolean;
	onEditStart?: () => void;
	onEdit?: ({
		updatedKey,
		updatedValue,
	}: {
		updatedKey: string;
		updatedValue: Primitive;
	}) => void;
	onDelete?: () => void;
	onCancel?: () => void;
}

export default function EmptyContainer({
	keyString = "",
	unflattenedValue,
	openingSymbol,
	closingSymbol,
	isAdding,
	onAdd,
	onAddStart,
	isEditing,
	onEdit,
	onEditStart,
	onDelete,
	onCancel,
}: EmptyContainerProps) {
	if (isAdding) {
		return (
			<>
				<pre className="font-bold">
					{keyString && `${keyString}: `}
					{openingSymbol}{" "}
				</pre>
				<KeyStringForm
					keyString={openingSymbol === "{" ? "" : "0"}
					value={""}
					editableKey={openingSymbol === "{"}
					onSubmit={onAdd}
					onCancel={onCancel}
				/>
				<pre className="font-bold">{closingSymbol}</pre>
			</>
		);
	}

	if (isEditing) {
		return (
			<KeyStringForm
				keyString={keyString ?? ""}
				value={parseValueIntoString(unflattenedValue)}
				onSubmit={onEdit}
				onCancel={onCancel}
			/>
		);
	}

	return (
		<div className="flex flex-row group gap-2">
			<pre className="font-bold">
				{keyString && `${keyString}: `}
				{openingSymbol}{" "}
				<span className="italic text-muted-foreground">Empty</span>{" "}
				{closingSymbol}
			</pre>
			<div className="invisible group-hover:visible">
				<ActionsContainer
					onAdd={onAddStart}
					onEdit={onEditStart}
					onDelete={onDelete}
				/>
			</div>
		</div>
	);
}
