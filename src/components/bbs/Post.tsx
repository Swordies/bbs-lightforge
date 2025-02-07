
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Edit2, Trash2, Reply as ReplyIcon, Link } from "lucide-react";
import { Reply } from "./Reply";
import { ReplyForm } from "./ReplyForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatText } from "@/lib/formatText";

interface PostProps {
  post: {
    id: string;
    content: string;
    author: string;
    authorIcon?: string;
    createdAt: Date;
    replies?: Array<{
      id: string;
      content: string;
      author: string;
      authorIcon?: string;
      createdAt: Date;
    }>;
  };
  user: { username: string } | null;
  editingPost: string | null;
  editContent: string;
  replyingTo: string | null;
  replyContent: string;
  setEditContent: (content: string) => void;
  setReplyContent: (content: string) => void;
  setReplyingTo: (id: string | null) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleSaveEdit: (id: string) => void;
  handleReply: (id: string) => void;
}

export const Post = ({
  post,
  user,
  editingPost,
  editContent,
  replyingTo,
  replyContent,
  setEditContent,
  setReplyContent,
  setReplyingTo,
  handleEdit,
  handleDelete,
  handleSaveEdit,
  handleReply,
}: PostProps) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = () => {
      if (deleteConfirmId) {
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [deleteConfirmId]);

  const handleDeleteClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === postId) {
      handleDelete(postId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(postId);
    }
  };

  const handlePermalink = (postId: string) => {
    navigate(`/thread/${postId}`);
  };

  return (
    <div className="space-y-2">
      <div className="bbs-card fade-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {post.authorIcon ? (
              <img
                src={post.authorIcon}
                alt={post.author}
                className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
              />
            ) : (
              <MessageSquare className="w-[100px] h-[100px]" />
            )}
            <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
              {post.author}
            </div>
          </div>
          
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
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="bbs-input w-full min-h-[100px]"
                  />
                  <Button
                    onClick={() => handleSaveEdit(post.id)}
                    className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div 
                  className="mb-4 whitespace-pre-wrap"
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
                        variant={deleteConfirmId === post.id ? "destructive" : "ghost"}
                        size="sm"
                        onClick={(e) => handleDeleteClick(post.id, e)}
                        className={`bbs-button hover:bg-[#1A1F2C] hover:text-white ${
                          deleteConfirmId === post.id ? 'bg-red-500 text-white' : ''
                        }`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> {deleteConfirmId === post.id ? 'Confirm Delete' : 'Delete'}
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
        </div>
      </div>

      {post.replies && post.replies.length > 0 && (
        <div className="pl-8 space-y-2">
          {post.replies.map((reply) => (
            <Reply key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};
