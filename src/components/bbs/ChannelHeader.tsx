
import { channels } from "@/constants/channels";

interface ChannelHeaderProps {
  channelId: string;
}

export const ChannelHeader = ({ channelId }: ChannelHeaderProps) => {
  const channel = channels[channelId as keyof typeof channels];

  if (!channel) return null;

  return (
    <div className="border-2 border-primary/50 p-4 mb-6">
      <div className="flex items-center gap-4">
        <img
          src={channel.image}
          alt={channel.title}
          className="w-16 h-16 object-cover border border-primary/50"
        />
        <div>
          <h1 className="text-2xl font-bold">{channel.title}</h1>
        </div>
      </div>
    </div>
  );
};

