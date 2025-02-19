"use client";

import JSONViewer from "@/components/json-viewer";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="flex flex-col h-screen p-4 gap-4 w-1/2">
        <div className="flex-1">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={20}
            className="h-full"
          />
        </div>
        <Button className="shrink-0" onClick={handleFormat}>
          Format
        </Button>
      </div>
      <div className="h-screen py-4 w-1/2 flex flex-col gap-4">
        <Button>Test</Button>
        <ScrollArea className="h-full">
          <JSONViewer text={text} onChange={handleChange} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
