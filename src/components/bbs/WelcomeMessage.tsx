
import { PostContainer } from "./PostContainer";

export const WelcomeMessage = () => {
  const welcomePost = {
    id: 'welcome',
    content: `**Welcome to ASCII BBS!**\n\nThis is a *minimalist* bulletin board system where you can:\n- Share your thoughts\n- Connect with others\n- Use **text formatting**\n\nFeel free to register and join the conversation!`,
    author: 'ASCII BBS',
    authorIcon: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop',
    createdAt: new Date(),
    replies: [{
      id: 'welcome-reply',
      content: "Hi there! This is what replies look like. They appear indented and aligned to the right. Try adding your own reply after logging in!",
      author: 'ASCII Helper',
      authorIcon: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=100&h=100&fit=crop',
      createdAt: new Date()
    }]
  };

  return (
    <PostContainer
      post={welcomePost}
      user={null}
      editingPost={null}
      editContent=""
      replyingTo={null}
      replyContent=""
      setEditContent={() => {}}
      setReplyContent={() => {}}
      setReplyingTo={() => {}}
      handleEdit={() => {}}
      handleDelete={() => {}}
      handleSaveEdit={() => {}}
      handleReply={() => {}}
    />
  );
};
