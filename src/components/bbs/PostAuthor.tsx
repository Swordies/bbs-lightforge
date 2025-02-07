
import { MessageSquare } from "lucide-react";
import { getContrastColor } from "@/lib/colorUtils";

interface PostAuthorProps {
  author: string;
  authorIcon?: string;
  usernameBoxColor?: string;
}

export const PostAuthor = ({ author, authorIcon, usernameBoxColor }: PostAuthorProps) => {
  return (
    <div className="flex-shrink-0">
      {authorIcon ? (
        <img
          src={authorIcon}
          alt={author}
          className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
        />
      ) : (
        <MessageSquare className="w-[100px] h-[100px]" />
      )}
      <div 
        className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50"
        style={usernameBoxColor ? { 
          backgroundColor: usernameBoxColor,
          color: getContrastColor(usernameBoxColor)
        } : undefined}
      >
        {author}
      </div>
    </div>
  );
};

