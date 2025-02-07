
import { Link } from "react-router-dom";

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

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Lightforge BBS</h1>
        <p className="text-muted-foreground">Choose a channel to start or join a discussion!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default Index;
