import { FlattenedJSONNode, JSONValue } from "../types";
import { memo, useState } from "react";
import BooleanDisplay from "./boolean-display";
import NumberDisplay from "./number-display";
import StringDisplay from "./string-display";
import NullDisplay from "./null-display";
import KeyStringForm from "../key-string-form";
import parseValueIntoString from "../utils/parse-value-into-string";
import ActionsContainer from "./actions-container";
import EmptyContainer from "./empty-object-container";
import OpeningSymbolContainer from "./opening-symbol-container";

interface LineRendererProps {
	node: FlattenedJSONNode;
	collapsed?: boolean;
	onCollapse?: () => void;
	onExpand?: () => void;
	onEdit?: ({
		updatedKey,
		updatedValue,
		id,
		path,
	}: {
		updatedKey: string;
		updatedValue: JSONValue;
		id: string;
		path: (string | number)[];
	}) => void;
	onDelete?: () => void;
	onAdd?: ({
		updatedKey,
		updatedValue,
		updatedIndex,
	}: {
		updatedKey: string;
		updatedValue: JSONValue;
		updatedIndex?: number;
	}) => void;
	numberOfChildren?: number;
	parent?: FlattenedJSONNode;
	indexInParent?: number;
	unflattenedValue: JSONValue;
	actualIndex?: number;
}
export default memo(function LineRenderer({
	node,
	onCollapse,
	onExpand,
	collapsed,
	numberOfChildren = 0,
	onEdit,
	onDelete,
	onAdd,
	unflattenedValue,
	parent,
	indexInParent = 0,
	actualIndex = 0,
}: LineRendererProps) {
	const {
		id,
		key: keyString,
		value,
		depth,
		path,
		children,
		openingSymbol,
		closingSymbol,
	} = node;

	function handleToggleExpand() {
		if (collapsed) {
			onExpand?.();
		} else {
			onCollapse?.();
		}
	}

	const [isEditing, setIsEditing] = useState(false);
	function handleEditSubmit({
		updatedKey,
		updatedValue,
	}: {
		updatedKey: string;
		updatedValue: JSONValue;
	}) {
		onEdit?.({ updatedKey, updatedValue, id, path });
		setIsEditing(false);
	}

	const [isAdding, setIsAdding] = useState(false);
	function handleAddSubmit({
		updatedKey,
		updatedValue,
		updatedIndex = 0,
	}: {
		updatedKey: string;
		updatedValue: JSONValue;
		updatedIndex?: number;
	}) {
		onAdd?.({ updatedKey, updatedValue, updatedIndex });
		setIsAdding(false);
	}

	const marginLeft = depth * 24;

	if (openingSymbol && closingSymbol) {
		return (
			<div style={{ marginLeft }}>
				<EmptyContainer
					keyString={keyString}
					unflattenedValue={unflattenedValue}
					openingSymbol={openingSymbol}
					closingSymbol={closingSymbol}
					isAdding={isAdding}
					onAddStart={() => setIsAdding(true)}
					onAdd={handleAddSubmit}
					isEditing={isEditing}
					onEditStart={() => setIsEditing(true)}
					onEdit={handleEditSubmit}
					onDelete={onDelete}
					onCancel={() => {
						setIsAdding(false);
						setIsEditing(false);
					}}
				/>
			</div>
		);
	}

	if (openingSymbol) {
		return (
			<div style={{ marginLeft }}>
				<OpeningSymbolContainer
					keyString={keyString}
					unflattenedValue={unflattenedValue}
					numberOfChildren={numberOfChildren}
					openingSymbol={openingSymbol}
					collapsed={collapsed}
					canExpand={children.length > 0 && !isEditing}
					onToggleExpand={handleToggleExpand}
					isEditing={isEditing}
					onEditStart={() => {
						onCollapse?.();
						setIsEditing(true);
					}}
					onEdit={handleEditSubmit}
					isAdding={isAdding}
					onAddStart={() => {
						onExpand?.();
						setIsAdding(true);
					}}
					onAdd={handleAddSubmit}
					onDelete={onDelete}
					onCancel={() => {
						setIsAdding(false);
						setIsEditing(false);
						onExpand?.();
					}}
				/>
			</div>
		);
	}

	if (closingSymbol) {
		return (
			<div style={{ marginLeft }}>
				<div className="flex flex-row gap-2 group">
					<pre className="font-bold">{closingSymbol}</pre>
					{depth > 0 && (
						<div className="group-hover:visible invisible">
							<ActionsContainer onAdd={() => setIsAdding(true)} />
						</div>
					)}
				</div>
				{isAdding && (
					<KeyStringForm
						keyString={
							parent?.openingSymbol === "["
								? (actualIndex + 1).toString() // [...otherChildren, opening, closing]
								: ""
						}
						value={""}
						editableKey={parent?.openingSymbol === "{"}
						onSubmit={({ updatedKey, updatedValue }) =>
							handleAddSubmit({
								updatedKey:
									parent?.closingSymbol === "]"
										? indexInParent.toString()
										: updatedKey,
								updatedValue,
								updatedIndex: indexInParent + 1,
							})
						}
						onCancel={() => setIsAdding(false)}
					/>
				)}
			</div>
		);
	}

	if (isEditing) {
		return (
			<div style={{ marginLeft }}>
				<KeyStringForm
					keyString={keyString ?? ""}
					value={parseValueIntoString(value)}
					onSubmit={handleEditSubmit}
					onCancel={() => setIsEditing(false)}
				/>
			</div>
		);
	}

	return (
		// primitive
		<div className="flex flex-col" style={{ marginLeft }}>
			<div
				className="flex flex-row group"
				onDoubleClick={() => setIsEditing(true)}
			>
				{keyString && <pre className="font-bold">{keyString}: </pre>}
				{typeof value === "boolean" ? (
					<BooleanDisplay value={value} />
				) : typeof value === "number" ? (
					<NumberDisplay value={value} />
				) : typeof value === "string" ? (
					<StringDisplay value={value} />
				) : (
					<NullDisplay />
				)}
				<div className="invisible group-hover:visible ml-2">
					<ActionsContainer
						onAdd={() => setIsAdding(true)}
						onEdit={() => setIsEditing(true)}
						onDelete={onDelete}
					/>
				</div>
			</div>
			{isAdding && (
				<KeyStringForm
					keyString={
						parent?.openingSymbol === "["
							? (parseInt(keyString!) + 1).toString()
							: ""
					}
					value={""}
					editableKey={parent?.openingSymbol === "{"}
					onSubmit={({ updatedKey, updatedValue }) =>
						handleAddSubmit({
							updatedKey,
							updatedValue,
							updatedIndex: indexInParent + 1,
						})
					}
					onCancel={() => setIsAdding(false)}
				/>
			)}
		</div>
	);
});
