
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { UserCircle, ImagePlus, Palette } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Link } from "react-router-dom";

const getContrastColor = (hexColor: string) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const Header = () => {
  const { user, logout, updateIcon, updateUsernameBoxColor } = useAuth();
  const [showIconInput, setShowIconInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  const [iconUrl, setIconUrl] = useState("");
  const [usernameBoxColor, setUsernameBoxColor] = useState("#1A1F2C");
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

  const handleUpdateColor = async () => {
    if (!usernameBoxColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      toast({
        title: "Error",
        description: "Please enter a valid hex color (e.g., #FF0000)",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updateUsernameBoxColor(usernameBoxColor);
      setShowColorInput(false);
      toast({
        title: "Success",
        description: "Your username box color has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username box color",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b-2 border-primary/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 bg-background/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2">
            <span className="text-2xl">
              +-[ Lightforge BBS ]-+
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.iconUrl ? (
                    <img src={user.iconUrl} alt={user.username} className="w-8 h-8 rounded-none border border-primary/50 object-cover" />
                  ) : (
                    <UserCircle className="w-8 h-8" />
                  )}
                  <span 
                    className="px-2 py-1 border border-primary/50"
                    style={{
                      backgroundColor: user.usernameBoxColor || '#1A1F2C',
                      color: user.usernameBoxColor ? getContrastColor(user.usernameBoxColor) : '#ffffff'
                    }}
                  >
                    {user.username}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setShowIconInput(!showIconInput)}>
                      <ImagePlus className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowColorInput(!showColorInput)}>
                      <Palette className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {showIconInput && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter image URL"
                      value={iconUrl}
                      onChange={(e) => setIconUrl(e.target.value)}
                      className="w-64 bbs-input"
                    />
                    <Button onClick={handleUpdateIcon} className="bbs-button">Update</Button>
                  </div>
                )}
                {showColorInput && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter hex color (e.g., #FF0000)"
                      value={usernameBoxColor}
                      onChange={(e) => setUsernameBoxColor(e.target.value)}
                      className="w-64 bbs-input"
                    />
                    <Button onClick={handleUpdateColor} className="bbs-button">Update</Button>
                  </div>
                )}
                <Button onClick={logout} variant="ghost" className="bbs-button">Logout</Button>
              </div>
            ) : (
              <Button onClick={() => window.location.href = "/auth"} className="bbs-button">Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

