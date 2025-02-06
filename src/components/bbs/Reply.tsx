
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
    <div className="fade-in">
      <div className="flex items-start gap-4">
        {reply.authorIcon ? (
          <img
            src={reply.authorIcon}
            alt={reply.author}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <MessageSquare className="w-8 h-8" />
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{reply.author}</span>
            <span className="text-sm text-muted-foreground">
              {reply.createdAt.toLocaleString()}
            </span>
          </div>
          <p>{reply.content}</p>
        </div>
      </div>
    </div>
  );
};
