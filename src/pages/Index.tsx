
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Edit2, Trash2, Reply } from "lucide-react";

interface Post {
  id: string;
  content: string;
  author: string;
  authorIcon?: string;
  createdAt: Date;
  replies?: Post[];
}

const Index = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "welcome",
      content: "Welcome to ASCII BBS! This is a minimalist bulletin board system where you can share your thoughts and connect with others. Feel free to register and join the conversation!",
      author: "Admin",
      authorIcon: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop",
      createdAt: new Date("2024-01-01T12:00:00"),
      replies: [
        {
          id: "welcome-reply",
          content: "Thanks for creating this space! The retro aesthetic brings back memories of the early internet days.",
          author: "RetroFan",
          authorIcon: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop",
          createdAt: new Date("2024-01-01T12:30:00"),
        },
      ],
    },
  ]);
  const [newPost, setNewPost] = useState("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handlePost = () => {
    if (!user || !newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
      replies: [],
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleEdit = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setEditingPost(postId);
      setEditContent(post.content);
    }
  };

  const handleSaveEdit = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, content: editContent } : post
      )
    );
    setEditingPost(null);
    setEditContent("");
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return;

    const reply: Post = {
      id: Date.now().toString(),
      content: replyContent,
      author: user.username,
      authorIcon: user.iconUrl,
      createdAt: new Date(),
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, replies: [...(post.replies || []), reply] }
          : post
      )
    );
    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {user && (
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
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bbs-card fade-in">
            <div className="flex items-start gap-4">
              {post.authorIcon ? (
                <img
                  src={post.authorIcon}
                  alt={post.author}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <MessageSquare className="w-10 h-10" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{post.author}</span>
                  <span className="text-sm text-muted-foreground">
                    {post.createdAt.toLocaleString()}
                  </span>
                </div>

                {editingPost === post.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="bbs-input w-full"
                    />
                    <Button
                      onClick={() => handleSaveEdit(post.id)}
                      className="bbs-button"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <p className="mb-4">{post.content}</p>
                )}

                <div className="flex items-center gap-2">
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(post.id)}
                    >
                      <Reply className="w-4 h-4 mr-1" /> Reply
                    </Button>
                  )}
                  {user && user.username === post.author && editingPost !== post.id && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(post.id)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </>
                  )}
                </div>

                {replyingTo === post.id && (
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="bbs-input w-full"
                    />
                    <Button
                      onClick={() => handleReply(post.id)}
                      className="bbs-button"
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {post.replies && post.replies.length > 0 && (
                  <div className="mt-4 space-y-4 pl-4 border-l border-border">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="fade-in">
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

