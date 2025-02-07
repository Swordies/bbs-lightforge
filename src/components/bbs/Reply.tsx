
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
        <div className="flex-shrink-0">
          {reply.authorIcon ? (
            <img
              src={reply.authorIcon}
              alt={reply.author}
              className="w-10 h-10 rounded-none border border-primary/50 object-cover"
            />
          ) : (
            <MessageSquare className="w-10 h-10" />
          )}
          <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
            {reply.author}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="speech-bubble">
            <div className="text-sm text-muted-foreground border border-primary/20 px-2 mb-4 inline-block">
              {reply.createdAt.toLocaleString()}
            </div>
            <div>
              {reply.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
