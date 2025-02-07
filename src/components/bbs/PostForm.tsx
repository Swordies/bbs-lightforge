
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PostFormProps {
  newPost: string;
  setNewPost: (value: string) => void;
  handlePost: () => void;
}

type FormatType = 'bold' | 'italic' | 'underline' | 'list';

export const PostForm = ({ newPost, setNewPost, handlePost }: PostFormProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeFormats, setActiveFormats] = useState<FormatType[]>([]);
  const [formatPositions, setFormatPositions] = useState<Record<FormatType, number>>({
    bold: -1,
    italic: -1,
    underline: -1,
    list: -1
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const start = e.currentTarget.selectionStart;
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
        case 'u':
          e.preventDefault();
          formatType = 'underline';
          break;
        case '-':
          e.preventDefault();
          formatType = 'list';
          break;
      }

      if (formatType) {
        toggleFormat(formatType, start);
      }
    }
  };

  const getFormatSyntax = (type: FormatType): { opening: string; closing: string } => {
    switch (type) {
      case 'bold':
        return { opening: '**', closing: '**' };
      case 'italic':
        return { opening: '_', closing: '_' };
      case 'underline':
        return { opening: '__', closing: '__' };
      case 'list':
        return { opening: '\n- ', closing: '' };
    }
  };

  const toggleFormat = (type: FormatType, cursorPos: number) => {
    if (activeFormats.includes(type)) {
      // Close the format
      const syntax = getFormatSyntax(type);
      const newValue = newPost + syntax.closing;
      setNewPost(newValue);
      setActiveFormats(activeFormats.filter(f => f !== type));
      setFormatPositions(prev => ({ ...prev, [type]: -1 }));

      // Set cursor position after the closing syntax
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = newValue.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          textareaRef.current.focus();
        }
      }, 0);
    } else {
      // Open the format
      const syntax = getFormatSyntax(type);
      const newValue = newPost + syntax.opening;
      setNewPost(newValue);
      setActiveFormats([...activeFormats, type]);
      setFormatPositions(prev => ({ ...prev, [type]: cursorPos }));

      // Set cursor position after the opening syntax
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = newValue.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const formatText = (type: FormatType) => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    toggleFormat(type, cursorPos);
  };

  return (
    <div className="bbs-card fade-in space-y-4">
      <div className="flex gap-2">
        <Button 
          variant={activeFormats.includes('bold') ? "default" : "outline"}
          size="icon"
          onClick={() => formatText('bold')}
          className={`bbs-button ${activeFormats.includes('bold') ? 'bg-[#1A1F2C] text-white' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.includes('italic') ? "default" : "outline"}
          size="icon"
          onClick={() => formatText('italic')}
          className={`bbs-button ${activeFormats.includes('italic') ? 'bg-[#1A1F2C] text-white' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.includes('underline') ? "default" : "outline"}
          size="icon"
          onClick={() => formatText('underline')}
          className={`bbs-button ${activeFormats.includes('underline') ? 'bg-[#1A1F2C] text-white' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          variant={activeFormats.includes('list') ? "default" : "outline"}
          size="icon"
          onClick={() => formatText('list')}
          className={`bbs-button ${activeFormats.includes('list') ? 'bg-[#1A1F2C] text-white' : ''}`}
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
