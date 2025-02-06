
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
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {reply.authorIcon ? (
                <img
                  src={reply.authorIcon}
                  alt={reply.author}
                  className="w-10 h-10 rounded-none border border-primary/50 object-cover"
                />
              ) : (
                <MessageSquare className="w-10 h-10" />
              )}
              <span className="font-bold px-2 py-1 border border-primary/50">
                {reply.author}
              </span>
            </div>
            <span className="text-sm text-muted-foreground border border-primary/20 px-2">
              {reply.createdAt.toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 border border-primary/20">
            {reply.content}
          </div>
        </div>
      </div>
    </div>
  );
};
