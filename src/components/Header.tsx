
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">ASCII BBS</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.iconUrl ? (
                  <img src={user.iconUrl} alt={user.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircle className="w-8 h-8" />
                )}
                <span>{user.username}</span>
              </div>
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
