"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { renderMarkdown } from "@/lib/utils";
import { Eye, PenLine } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Markdownで思考プロセスを記述...\n\n**太字**, *斜体*, `コード`, > 引用 が使えます",
  rows = 4,
}: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="h-8">
        <TabsTrigger value="write" className="text-xs gap-1 h-6">
          <PenLine className="h-3 w-3" />
          編集
        </TabsTrigger>
        <TabsTrigger value="preview" className="text-xs gap-1 h-6">
          <Eye className="h-3 w-3" />
          プレビュー
        </TabsTrigger>
      </TabsList>
      <TabsContent value="write" className="mt-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm"
        />
      </TabsContent>
      <TabsContent value="preview" className="mt-2">
        <div className="min-h-[80px] rounded-md border bg-background p-3">
          {value ? (
            <div
              className="markdown-content text-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">プレビューなし</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
