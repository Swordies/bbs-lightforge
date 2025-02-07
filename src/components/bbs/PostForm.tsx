
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, List, Strikethrough } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PostFormProps {
  newPost: string;
  setNewPost: (value: string) => void;
  handlePost: () => void;
  isEditing?: boolean;
}

type FormatType = 'bold' | 'italic' | 'list' | 'strikethrough';

export const PostForm = ({ newPost, setNewPost, handlePost, isEditing }: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      let formatType: FormatType | null = null;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatType = 'bold';
          break;
        case 'i':
          e.preventDefault();
          formatType = 'italic';
          break;
        case '-':
          e.preventDefault();
          formatType = 'list';
          break;
        case 's':
          e.preventDefault();
          formatType = 'strikethrough';
          break;
      }

      if (formatType) {
        applyFormat(formatType);
      }
    }
  };

  const getFormatSyntax = (type: FormatType): { opening: string; closing: string } => {
    switch (type) {
      case 'bold':
        return { opening: '**', closing: '**' };
      case 'italic':
        return { opening: '_', closing: '_' };
      case 'strikethrough':
        return { opening: '~~', closing: '~~' };
      case 'list':
        return { opening: '\n- ', closing: '' };
    }
  };

  const applyFormat = (type: FormatType) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newPost.substring(start, end);
    const syntax = getFormatSyntax(type);

    if (start === end && type === 'list') {
      // If no text is selected and it's a list, just add the list marker
      const newValue = newPost.substring(0, start) + syntax.opening + newPost.substring(end);
      setNewPost(newValue);
      
      // Set cursor position after the list marker
      setTimeout(() => {
        const newPosition = start + syntax.opening.length;
        textarea.selectionStart = newPosition;
        textarea.selectionEnd = newPosition;
        textarea.focus();
      }, 0);
    } else {
      // For other formats or when text is selected
      const newValue = newPost.substring(0, start) + 
                      syntax.opening + 
                      selectedText + 
                      syntax.closing + 
                      newPost.substring(end);
      setNewPost(newValue);

      // Maintain selection including the formatting syntax
      setTimeout(() => {
        const newStart = start + syntax.opening.length;
        const newEnd = end + syntax.opening.length;
        textarea.selectionStart = newStart;
        textarea.selectionEnd = newEnd;
        textarea.focus();
      }, 0);
    }
  };

  return (
    <div className="bbs-card fade-in space-y-4">
      <div className="flex gap-2">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => applyFormat('bold')}
          className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => applyFormat('italic')}
          className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => applyFormat('strikethrough')}
          className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
          title="Strikethrough (Ctrl+S)"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={() => applyFormat('list')}
          className="bbs-button hover:bg-[#1A1F2C] hover:text-white"
          title="List (Ctrl+-)"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        placeholder={isEditing 
          ? "Edit your post..." 
          : "What's on your mind? Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+S for strikethrough"}
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        onKeyDown={handleKeyDown}
        className="bbs-input w-full min-h-[100px]"
      />
      <Button onClick={handlePost} className="bbs-button hover:bg-[#1A1F2C] hover:text-white">
        {isEditing ? 'Save' : 'Post'}
      </Button>
    </div>
  );
};

