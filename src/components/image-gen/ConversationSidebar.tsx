import { useState } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Pin, Edit2, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
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

interface Conversation {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: Date;
}

interface ConversationSidebarProps {
  currentConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
}

const ConversationSidebar = ({ 
  currentConversationId, 
  onConversationSelect,
  onNewChat 
}: ConversationSidebarProps) => {
  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Create sunset image", pinned: true, createdAt: new Date("2024-11-18") },
    { id: "2", title: "Design logo concept", pinned: false, createdAt: new Date("2024-11-17") },
    { id: "3", title: "Mountain landscape", pinned: false, createdAt: new Date("2024-11-16") },
  ]);

  const [longPressId, setLongPressId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMouseDown = (id: string) => {
    const timer = setTimeout(() => {
      setLongPressId(id);
    }, 500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handlePin = (id: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
      )
    );
    setLongPressId(null);
  };

  const handleEdit = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setEditTitle(conv.title);
      setEditDialog(id);
    }
    setLongPressId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteDialog(id);
    setLongPressId(null);
  };

  const confirmDelete = () => {
    if (deleteDialog) {
      setConversations(prev => prev.filter(conv => conv.id !== deleteDialog));
      setDeleteDialog(null);
    }
  };

  const confirmEdit = () => {
    if (editDialog && editTitle.trim()) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === editDialog ? { ...conv, title: editTitle } : conv
        )
      );
      setEditDialog(null);
      setEditTitle("");
    }
  };

  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <>
      <Sidebar className="border-r border-border">
        <SidebarHeader className="border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {sortedConversations.map((conv) => (
                <div key={conv.id} className="relative">
                  <Button
                    variant={currentConversationId === conv.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left relative group",
                      currentConversationId === conv.id && "bg-secondary"
                    )}
                    onClick={() => onConversationSelect(conv.id)}
                    onMouseDown={() => handleMouseDown(conv.id)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={() => handleMouseDown(conv.id)}
                    onTouchEnd={handleMouseUp}
                  >
                    {conv.pinned && <Pin className="h-3 w-3 mr-2 text-muted-foreground" />}
                    <span className="truncate flex-1">{conv.title}</span>
                  </Button>

                  {longPressId === conv.id && (
                    <div className="absolute top-0 right-0 bg-card border border-border rounded-md shadow-lg p-2 flex gap-1 z-50">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handlePin(conv.id)}
                      >
                        <Pin className={cn("h-4 w-4", conv.pinned && "fill-current")} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleEdit(conv.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(conv.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setLongPressId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => {}}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
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

      {/* Edit Title Dialog */}
      <AlertDialog open={!!editDialog} onOpenChange={(open) => !open && setEditDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Conversation Title</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter new title"
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
    </>
  );
};

export default ConversationSidebar;
