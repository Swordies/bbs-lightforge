
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  replyContent: string;
  setReplyContent: (value: string) => void;
  handleReply: () => void;
}

export const ReplyForm = ({ replyContent, setReplyContent, handleReply }: ReplyFormProps) => {
  return (
    <div className="mt-4 space-y-2">
      <Textarea
        placeholder="Write a reply..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        className="bbs-input w-full"
      />
      <Button onClick={handleReply} className="bbs-button">
        Reply
      </Button>
    </div>
  );
};
