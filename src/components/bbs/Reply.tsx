
import { MessageSquare } from "lucide-react";

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
  };
}

export const Reply = ({ reply }: ReplyProps) => {
  return (
    <div className="bbs-card fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-primary">{"[" + reply.author + "]"}</span>
            <span className="text-sm text-muted-foreground font-mono">
              {reply.createdAt.toLocaleString()}
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-mono">{reply.content}</pre>
        </div>
        {reply.authorIcon && (
          <img
            src={reply.authorIcon}
            alt={reply.author}
            className="w-[40px] h-[40px] object-cover border border-primary/50"
          />
        )}
      </div>
    </div>
  );
};
