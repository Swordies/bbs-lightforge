
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { UserCircle, ImagePlus } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user, logout, updateIcon } = useAuth();
  const [showIconInput, setShowIconInput] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const { toast } = useToast();

  const handleUpdateIcon = async () => {
    if (!iconUrl.trim()) return;
    
    try {
      await updateIcon(iconUrl);
      setShowIconInput(false);
      setIconUrl("");
      toast({
        title: "Success",
        description: "Your icon has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update icon",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b border-border/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">ASCII BBS</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.iconUrl ? (
                  <img src={user.iconUrl} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
                <span>{user.username}</span>
                <Button variant="ghost" size="icon" onClick={() => setShowIconInput(!showIconInput)}>
                  <ImagePlus className="w-4 h-4" />
                </Button>
              </div>
              {showIconInput && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Enter image URL"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={handleUpdateIcon}>Update</Button>
                </div>
              )}
              <Button onClick={logout} variant="ghost">Logout</Button>
            </div>
          ) : (
            <Button onClick={() => window.location.href = "/auth"}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
};
