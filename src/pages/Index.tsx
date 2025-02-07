
import { ChannelGrid } from "@/components/home/ChannelGrid";
import { WelcomeMessage } from "@/components/home/WelcomeMessage";
import { PlaceholderReply } from "@/components/home/PlaceholderReply";

const Index = () => {
  return (
    <div className="max-w-5xl mx-auto px-2">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Lightforge BBS</h1>
        <p className="text-muted-foreground">Choose a channel to start or join a discussion!</p>
      </div>

      <ChannelGrid />
      <WelcomeMessage />
      <PlaceholderReply />
    </div>
  );
};

export default Index;

