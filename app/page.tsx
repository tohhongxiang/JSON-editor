"use client";

import JSONViewer from "@/components/lossless-json-viewer-virtualized";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { parse, stringify } from "lossless-json";
import { CircleCheckBig, Copy } from "lucide-react";
import { useState } from "react";

export default function Home() {
    const [text, setText] = useState(
        `{"a": 128, "b": "hello", "c": false, "d": null, "e": [1, false, "2", null], "f": {"g": 828, "h": "goodbye", "nested": { "object": [1, 2, 3], "lorem": "ipsum" }}, "i": [], "j": {}}`,
    );

    function handleChange(updatedValue: string) {
        setText(updatedValue);
    }

    function handleFormat() {
        setText((c) => {
            try {
                return stringify(parse(c), null, 2)!;
            } catch {
                return c;
            }
        });
    }

    function handleCopy() {
        navigator.clipboard.writeText(text);
        toast({
            description: (
                <div className="flex flex-row items-center gap-2">
                    <CircleCheckBig className="font-bold text-green-500" />
                    <p>Copied to clipboard</p>
                </div>
            ),
        });
    }

    return (
        <div className="flex h-screen w-screen flex-row">
            <div className="flex h-screen w-1/2 flex-col gap-2 border-r">
                <div className="mb-1 flex flex-row items-center justify-between border-b px-4 py-2">
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
                <div className="px-4 py-2">
                    <Button className="w-full shrink-0" onClick={handleFormat}>
                        Format
                    </Button>
                </div>
            </div>
            <div className="flex h-screen w-1/2 flex-col">
                <div className="mb-1 flex flex-row items-center justify-between border-b px-4 py-2">
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
