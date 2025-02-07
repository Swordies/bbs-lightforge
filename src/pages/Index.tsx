
import { Link } from "react-router-dom";

const channels = {
  "tech": {
    title: "Technology",
    description: "Discuss programming, hardware, and all things tech",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop",
  },
  "creative": {
    title: "Creative",
    description: "Share your art, music, and creative projects",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop",
  },
  "random": {
    title: "Random",
    description: "General discussion about anything and everything",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop",
  },
};

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to ASCII BBS</h1>
        <p className="text-muted-foreground">Choose a channel to start discussing</p>
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
                <p className="text-muted-foreground text-sm">{channel.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
