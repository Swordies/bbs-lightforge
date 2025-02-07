
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatText } from "@/lib/formatText";
import { Edit2, Trash2, Reply as ReplyIcon, Link } from "lucide-react";
import { ReplyForm } from "./ReplyForm";
import { PostForm } from "./PostForm";

interface PostContentProps {
  post: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  };
  user: { username: string } | null;
  editingPost: string | null;
  editContent: string;
  replyingTo: string | null;
  replyContent: string;
  deleteConfirmId: string | null;
  setEditContent: (content: string) => void;
  setReplyContent: (content: string) => void;
  setReplyingTo: (id: string | null) => void;
  handleEdit: (id: string) => void;
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  handleSaveEdit: (id: string) => void;
  handleReply: (id: string) => void;
  handlePermalink: (id: string) => void;
}

export const PostContent = ({
  post,
  user,
  editingPost,
  editContent,
  replyingTo,
  replyContent,
  deleteConfirmId,
  setEditContent,
  setReplyContent,
  setReplyingTo,
  handleEdit,
  handleDeleteClick,
  handleSaveEdit,
  handleReply,
  handlePermalink,
}: PostContentProps) => {
  return (
    <div className="flex-1">
      <div className="speech-bubble">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground border border-primary/20 px-2 inline-block">
            {post.createdAt.toLocaleString()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePermalink(post.id)}
            className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
          >
            <Link className="w-4 h-4" />
          </Button>
        </div>

        {editingPost === post.id ? (
          <PostForm
            newPost={editContent}
            setNewPost={setEditContent}
            handlePost={() => handleSaveEdit(post.id)}
            isEditing={true}
          />
        ) : (
          <div 
            className="mb-4 [&_strong]:font-bold [&_em]:italic [&_u]:border-b-2 [&_s]:line-through [&_br]:block"
            dangerouslySetInnerHTML={{ 
              __html: formatText(post.content) 
            }} 
          />
        )}

        {!editingPost && (
          <div className="flex items-center gap-2 mt-4">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(post.id)}
                className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
              >
                <ReplyIcon className="w-4 h-4 mr-1" /> Reply
              </Button>
            )}
            {user && user.username === post.author && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(post.id)}
                  className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleDeleteClick(post.id, e)}
                  className={`bbs-button hover:bg-[#1A1F2C] hover:text-white ${
                    deleteConfirmId === post.id ? 'bg-red-500/80 text-white hover:bg-red-600' : ''
                  }`}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {replyingTo === post.id && !editingPost && (
        <ReplyForm
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleReply={() => handleReply(post.id)}
          onCancel={() => setReplyingTo(null)}
        />
      )}
    </div>
  );
};
