"use client";

import { useState } from "react";
import type { HandComment } from "@/types/poker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MessageSquare, Reply, Send } from "lucide-react";

interface ThreadedCommentsProps {
  comments: HandComment[];
  handId: string;
}

function CommentItem({
  comment,
  replies,
  onReply,
}: {
  comment: HandComment;
  replies: HandComment[];
  onReply: (parentId: string, content: string) => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowReply(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/20 text-xs font-bold text-emerald">
            {comment.playerName.charAt(0)}
          </div>
          <span className="text-sm font-medium">{comment.playerName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{comment.content}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-7 text-xs text-muted-foreground"
          onClick={() => setShowReply(!showReply)}
        >
          <Reply className="mr-1 h-3 w-3" />
          返信
        </Button>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-6 space-y-2 border-l-2 border-emerald/20 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-border/50 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                  {reply.playerName.charAt(0)}
                </div>
                <span className="text-xs font-medium">{reply.playerName}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(reply.createdAt).toLocaleDateString("ja-JP", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-xs leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {showReply && (
        <div className="ml-6 flex gap-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="返信を入力..."
            rows={2}
            className="text-sm"
          />
          <Button
            size="icon"
            className="shrink-0"
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ThreadedComments({ comments, handId }: ThreadedCommentsProps) {
  const [allComments, setAllComments] = useState<HandComment[]>(comments);
  const [newComment, setNewComment] = useState("");

  const rootComments = allComments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    allComments.filter((c) => c.parentId === parentId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: HandComment = {
      id: `c-new-${Date.now()}`,
      handId,
      playerId: "p1",
      playerName: "武 (Takeshi)",
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setAllComments([...allComments, comment]);
    setNewComment("");
  };

  const handleReply = (parentId: string, content: string) => {
    const reply: HandComment = {
      id: `c-reply-${Date.now()}`,
      handId,
      playerId: "p1",
      playerName: "武 (Takeshi)",
      content,
      parentId,
      createdAt: new Date().toISOString(),
    };
    setAllComments([...allComments, reply]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-emerald" />
        <h3 className="text-sm font-semibold">
          ディスカッション ({allComments.length})
        </h3>
      </div>

      {/* Comment List */}
      <div className="space-y-3">
        {rootComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            onReply={handleReply}
          />
        ))}
      </div>

      {/* New Comment */}
      <div className="flex gap-2 border-t pt-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを追加..."
          rows={2}
          className="text-sm"
        />
        <Button
          size="icon"
          className="shrink-0"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
