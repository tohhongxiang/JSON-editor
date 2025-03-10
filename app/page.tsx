"use client";

import JSONViewer from "@/components/json-viewer-virtualized";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { CircleCheckBig, Copy } from "lucide-react";
import { useState } from "react";

export default function Home() {
	const [text, setText] = useState(
		`{"a": 128, "b": "hello", "c": false, "d": null, "e": [1, false, "2", null], "f": {"g": 828, "h": "goodbye"}, "i": [], "j": {}}`
	);

	function handleChange(updatedValue: string) {
		setText(updatedValue);
	}

	function handleFormat() {
		setText((c) => {
			try {
				return JSON.stringify(JSON.parse(c), null, 2);
			} catch {
				return c;
			}
		});
	}

	function handleCopy() {
		navigator.clipboard.writeText(text);
		toast({
			description: (
				<div className="flex flex-row gap-2 items-center">
					<CircleCheckBig className="text-green-500 font-bold" />
					<p>Copied to clipboard</p>
				</div>
			),
		});
	}

	return (
		<div className="flex flex-row h-screen w-screen">
			<div className="flex flex-col h-screen gap-2 w-1/2 border-r">
				<div className="border-b mb-1 flex flex-row justify-between items-center py-2 px-4">
					<h1 className="font-bold">Input</h1>
					<Button onClick={handleCopy}>
						<Copy />
					</Button>
				</div>
				<div className="flex-1 px-4">
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={20}
						className="h-full resize-none"
					/>
				</div>
				<div className="py-2 px-4">
					<Button className="shrink-0 w-full" onClick={handleFormat}>
						Format
					</Button>
				</div>
			</div>
			<div className="h-screen w-1/2 flex flex-col">
				<div className="border-b mb-1 flex flex-row justify-between items-center py-2 px-4">
					<h1 className="font-bold">Output</h1>
					<Button onClick={handleCopy}>
						<Copy />
					</Button>
				</div>
				<JSONViewer text={text} onChange={handleChange} />
			</div>
		</div>
	);
}
