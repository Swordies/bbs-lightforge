
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, List } from "lucide-react";
import { useEffect, useRef } from "react";

interface PostFormProps {
  newPost: string;
  setNewPost: (value: string) => void;
  handlePost: () => void;
}

export const PostForm = ({ newPost, setNewPost, handlePost }: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      let newValue = value;
      let newCursorPos = end;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          newValue = value.substring(0, start) + 
            `**${value.substring(start, end)}**` + 
            value.substring(end);
          newCursorPos = end + 4;
          break;
        case 'i':
          e.preventDefault();
          newValue = value.substring(0, start) + 
            `_${value.substring(start, end)}_` + 
            value.substring(end);
          newCursorPos = end + 2;
          break;
        case 'u':
          e.preventDefault();
          newValue = value.substring(0, start) + 
            `__${value.substring(start, end)}__` + 
            value.substring(end);
          newCursorPos = end + 4;
          break;
        case '-':
          e.preventDefault();
          newValue = value.substring(0, start) + 
            `\n- ${value.substring(start, end)}` + 
            value.substring(end);
          newCursorPos = end + 3;
          break;
      }

      setNewPost(newValue);
      // Set cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const formatText = (type: 'bold' | 'italic' | 'underline' | 'list') => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const value = textareaRef.current.value;
    let newValue = value;
    let newCursorPos = end;

    switch (type) {
      case 'bold':
        newValue = value.substring(0, start) + 
          `**${value.substring(start, end)}**` + 
          value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newValue = value.substring(0, start) + 
          `_${value.substring(start, end)}_` + 
          value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newValue = value.substring(0, start) + 
          `__${value.substring(start, end)}__` + 
          value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'list':
        newValue = value.substring(0, start) + 
          `\n- ${value.substring(start, end)}` + 
          value.substring(end);
        newCursorPos = end + 3;
        break;
    }

    setNewPost(newValue);
    // Set cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="bbs-card fade-in space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => formatText('bold')}
          className="bbs-button"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => formatText('italic')}
          className="bbs-button"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => formatText('underline')}
          className="bbs-button"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => formatText('list')}
          className="bbs-button"
          title="List (Ctrl+-)"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        placeholder="What's on your mind? Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline"
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bbs-input w-full min-h-[100px]"
      />
      <Button onClick={handlePost} className="bbs-button hover:bg-[#1A1F2C] hover:text-white">
        Post
      </Button>
    </div>
  );
};
