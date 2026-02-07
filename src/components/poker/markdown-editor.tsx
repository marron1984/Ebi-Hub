"use client";

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { renderMarkdown } from "@/lib/utils";
import { Eye, PenLine, ImagePlus, FunctionSquare } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Optional: images attached to this thought process */
  images?: string[];
  onImageAdd?: (url: string) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Markdownで思考プロセスを記述...\n\n**太字**, *斜体*, `コード`, > 引用, $EV計算$ が使えます",
  rows = 4,
  images = [],
  onImageAdd,
}: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local URL for preview (in production, upload to server)
    const url = URL.createObjectURL(file);
    const markdown = `\n![${file.name}](${url})\n`;
    insertAtCursor(markdown);
    if (onImageAdd) onImageAdd(url);

    e.target.value = "";
  };

  const insertMathTemplate = () => {
    insertAtCursor("$EV = (勝率 × ポット) - (敗率 × ベット額)$");
  };

  return (
    <Tabs defaultValue="write" className="w-full">
      <div className="flex items-center justify-between">
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
        <div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
            title="画像を添付"
          >
            <ImagePlus className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={insertMathTemplate}
            title="数式を挿入"
          >
            <FunctionSquare className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <TabsContent value="write" className="mt-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="font-mono text-sm"
        />
        <p className="mt-1 text-[10px] text-muted-foreground">
          **太字** *斜体* `コード` &gt; 引用 $数式$ $$ブロック数式$$ ![画像](URL)
        </p>
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

      {/* Attached images preview */}
      {images.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {images.map((url, i) => (
            <div key={i} className="image-attachment w-20 h-20">
              <img src={url} alt={`添付${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </Tabs>
  );
}
