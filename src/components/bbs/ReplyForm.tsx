
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostForm } from "./PostForm";

interface ReplyFormProps {
  replyContent: string;
  setReplyContent: (value: string) => void;
  handleReply: () => void;
  onCancel: () => void;
}

export const ReplyForm = ({ replyContent, setReplyContent, handleReply, onCancel }: ReplyFormProps) => {
  return (
    <div className="mt-4 space-y-2">
      <PostForm
        newPost={replyContent}
        setNewPost={setReplyContent}
        handlePost={handleReply}
      />
      <Button onClick={onCancel} variant="outline" className="mt-2">
        Cancel
      </Button>
    </div>
  );
};

