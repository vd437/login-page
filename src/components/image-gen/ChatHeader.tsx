import { Button } from "@/components/ui/button";
import { Menu, MoreVertical, PenLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onClearChat: () => void;
  conversationTitle?: string;
}

const ChatHeader = ({ onToggleSidebar, onNewChat, onClearChat, conversationTitle = "New Chat" }: ChatHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [editTitle, setEditTitle] = useState(conversationTitle);
  const { toast } = useToast();

  const handleEditTitle = () => {
    setEditTitle(conversationTitle);
    setShowEditDialog(true);
    setShowMenu(false);
  };

  const handleDeleteChat = () => {
    setShowDeleteDialog(true);
    setShowMenu(false);
  };

  const handleReportChat = () => {
    setShowReportDialog(true);
    setShowMenu(false);
  };

  const confirmEdit = () => {
    toast({
      title: "Title updated",
      description: "Conversation title has been updated successfully",
    });
    setShowEditDialog(false);
  };

  const confirmDelete = () => {
    onClearChat();
    setShowDeleteDialog(false);
    toast({
      title: "Chat deleted",
      description: "Conversation has been deleted",
    });
  };

  const confirmReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for your feedback",
    });
    setShowReportDialog(false);
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="h-10 w-10 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewChat}
              className="h-10 w-10 rounded-full"
            >
              <PenLine className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(true)}
            className="h-10 w-10 rounded-full"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Chat Options Menu */}
      <Dialog open={showMenu} onOpenChange={setShowMenu}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chat Options</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleEditTitle}
            >
              <PenLine className="mr-2 h-4 w-4" />
              Edit Chat Name
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDeleteChat}
            >
              <Menu className="mr-2 h-4 w-4" />
              Delete Chat
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleReportChat}
            >
              <MoreVertical className="mr-2 h-4 w-4" />
              Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Title Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Chat Name</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter chat name"
                className="mt-4"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEdit}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
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
              <Input
                placeholder="Describe the issue..."
                className="mt-4"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
