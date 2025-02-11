
import PostAuthor from "./PostAuthor";
import { PostContent } from "./PostContent";
import { useDeleteConfirm } from "./useDeleteConfirm";
import { type Post as PostType } from "@/types/channel";

interface PostProps {
  post: PostType;
  user: { username: string; usernameBoxColor?: string } | null;
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
  const { deleteConfirmId, setDeleteConfirmId, handleDeleteClick } = useDeleteConfirm();

  const handlePostDeleteClick = (postId: string, e: React.MouseEvent<Element, MouseEvent>) => {
    if (handleDeleteClick(postId, e)) {
      handleDelete(postId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(postId);
    }
  };

  const usernameBoxColor = user?.username === post.author ? user?.usernameBoxColor : undefined;

  return (
    <div id={post.id} className="bbs-card fade-in">
      <div className="flex items-start gap-4">
        <PostAuthor 
          author={post.author} 
          authorIcon={post.authorIcon}
          usernameBoxColor={usernameBoxColor}
        />
        <PostContent
          post={post}
          user={user}
          editingPost={editingPost}
          editContent={editContent}
          replyingTo={replyingTo}
          replyContent={replyContent}
          deleteConfirmId={deleteConfirmId}
          setEditContent={setEditContent}
          setReplyContent={setReplyContent}
          setReplyingTo={setReplyingTo}
          handleEdit={handleEdit}
          handleDeleteClick={handlePostDeleteClick}
          handleSaveEdit={handleSaveEdit}
          handleReply={handleReply}
          handlePermalink={(id: string) => {}}
        />
      </div>
    </div>
  );
};
