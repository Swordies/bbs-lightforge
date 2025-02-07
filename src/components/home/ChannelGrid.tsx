
import { Link } from "react-router-dom";
import { channels } from "@/constants/channels";

export const ChannelGrid = () => {
  return (
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
              loading="lazy"
            />
            <div>
              <h2 className="text-xl font-bold">{channel.title}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

