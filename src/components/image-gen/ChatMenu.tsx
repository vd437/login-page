import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Flag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

interface ChatMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearChat: () => void;
}

const ChatMenu = ({ open, onOpenChange, onClearChat }: ChatMenuProps) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { toast } = useToast();

  const handleClearChat = () => {
    onClearChat();
    setShowClearConfirm(false);
    onOpenChange(false);
  };

  const handleReportChat = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback",
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chat Options</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onOpenChange(false);
                setShowClearConfirm(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleReportChat}
            >
              <Flag className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all images?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all generated images from this chat. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatMenu;
