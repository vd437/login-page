import { Button } from "@/components/ui/button";
import { Settings, MoreVertical, LogOut, Eraser, Flag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleClearChat = () => {
    setShowClearDialog(true);
  };

  const handleReportChat = () => {
    setShowReportDialog(true);
  };

  const confirmClear = () => {
    onClearChat();
    setShowClearDialog(false);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };

  const confirmReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback",
    });
    setReportReason("");
    setShowReportDialog(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      <header className="flex items-center justify-between p-4">
        {/* Settings Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Settings className="h-6 w-6" />
        </Button>

        {/* Menu Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MoreVertical className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleClearChat}>
              <Eraser className="mr-2 h-4 w-4" />
              Clear Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReportChat}>
              <Flag className="mr-2 h-4 w-4" />
              Report Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Clear Chat Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Dialog */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Please describe the issue you're experiencing with this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue..."
            className="mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReport}>
              Submit Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHeader;
