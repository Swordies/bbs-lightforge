
import { formatText } from "@/lib/formatText";

const placeholderReply = `_Indeed!_ This BBS is a great place to connect.

Some tips for new users:
- Be kind and respectful
- Use **formatting** to make your posts more readable
- ~~Write very long posts~~ Keep things concise
- Have fun!`;

export const PlaceholderReply = () => {
  return (
    <div className="ml-24 bbs-card fade-in mt-2">
      <div className="flex items-start gap-4 flex-row-reverse">
        <div className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop"
            alt="Moderator"
            className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
            loading="lazy"
          />
          <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
            Moderator
          </div>
        </div>
        <div className="flex-1">
          <div className="speech-bubble speech-bubble-right">
            <div className="text-sm text-muted-foreground border border-primary/20 px-2 mb-4 inline-block">
              {new Date().toLocaleString()}
            </div>
            <div 
              className="[&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_br]:block"
              dangerouslySetInnerHTML={{ __html: formatText(placeholderReply) }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

