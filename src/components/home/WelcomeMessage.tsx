
import { formatText } from "@/lib/formatText";

const welcomeMessage = `Here you can:
- Share your thoughts and ideas
- Connect with other members
- Explore different topics
- Have meaningful discussions

You can use _italic text_ for emphasis, **bold text** for important points, and ~~strikethrough~~ for corrections.`;

export const WelcomeMessage = () => {
  return (
    <div className="bbs-card fade-in">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop"
            alt="Admin"
            className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
            loading="lazy"
          />
          <div className="text-sm mt-2 text-center font-bold px-2 py-1 border border-primary/50">
            Admin
          </div>
        </div>
        <div className="flex-1">
          <div className="speech-bubble">
            <div className="text-sm text-muted-foreground border border-primary/20 px-2 mb-4 inline-block">
              {new Date().toLocaleString()}
            </div>
            <div 
              className="[&_strong]:font-bold [&_em]:italic [&_s]:line-through [&_br]:block"
              dangerouslySetInnerHTML={{ __html: formatText(welcomeMessage) }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

