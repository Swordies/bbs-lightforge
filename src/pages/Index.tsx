
import { Link } from "react-router-dom";
import { formatText } from "@/lib/formatText";

const channels = {
  "general": {
    title: "General",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
  },
  "creative": {
    title: "Creative",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop",
  },
  "showerthoughts": {
    title: "Showerthoughts",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100&h=100&fit=crop",
  },
  "quest": {
    title: "Quest",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100&h=100&fit=crop",
  },
  "sandbox": {
    title: "Sandbox",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop",
  },
  "memes": {
    title: "Memes",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop",
  },
};

const welcomeMessage = `Here you can:
- Share your thoughts and ideas
- Connect with other members
- Explore different topics
- Have meaningful discussions

You can use _italic text_ for emphasis, **bold text** for important points, and ~~strikethrough~~ for corrections.`;

const placeholderReply = `_Indeed!_ This BBS is a great place to connect.

Some tips for new users:
- Be kind and respectful
- Use **formatting** to make your posts more readable
- ~~Write very long posts~~ Keep things concise
- Have fun!`;

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Lightforge BBS</h1>
        <p className="text-muted-foreground">Choose a channel to start or join a discussion!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(channels).map(([id, channel]) => (
          <Link
            key={id}
            to={`/channel/${id}`}
            className="block border-2 border-primary/50 p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-4">
              <img
                src={channel.image}
                alt={channel.title}
                className="w-16 h-16 object-cover border border-primary/50"
              />
              <div>
                <h2 className="text-xl font-bold">{channel.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bbs-card fade-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop"
              alt="Admin"
              className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
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

      <div className="ml-24 bbs-card fade-in mt-2">
        <div className="flex items-start gap-4 flex-row-reverse">
          <div className="flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop"
              alt="Moderator"
              className="w-[100px] h-[100px] rounded-none border border-primary/50 object-cover"
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
    </div>
  );
};

export default Index;

