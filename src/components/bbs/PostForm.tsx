
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PostFormProps {
  newPost: string;
  setNewPost: (value: string) => void;
  handlePost: () => void;
}

export const PostForm = ({ newPost, setNewPost, handlePost }: PostFormProps) => {
  return (
    <div className="bbs-card fade-in">
      <Textarea
        placeholder="What's on your mind?"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="bbs-input w-full mb-4"
      />
      <Button onClick={handlePost} className="bbs-button">
        Post
      </Button>
    </div>
  );
};
