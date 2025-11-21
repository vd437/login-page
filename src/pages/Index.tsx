import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, ImageIcon, Sparkles, Loader2, X, Palette, Grid3x3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StyleSelector from "@/components/image-gen/StyleSelector";
import SizeSelector from "@/components/image-gen/SizeSelector";
import ImageResult from "@/components/image-gen/ImageResult";
import ChatHeader from "@/components/image-gen/ChatHeader";
import ConversationSidebar from "@/components/image-gen/ConversationSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImage } from "@/types/image";

interface ChatMessage {
  prompt: string;
  status: "creating" | "completed";
  images?: GeneratedImage[];
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState({ width: 1024, height: 1024, label: "Square (1:1)" });
  const [imageCount, setImageCount] = useState(1);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>("1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }

    const currentPrompt = prompt;
    setPrompt(""); // Clear the input field
    setChatMessages(prev => [...prev, { prompt: currentPrompt, status: "creating" }]);
    setIsGenerating(true);
    
    try {
      const finalPrompt = selectedStyle 
        ? `${currentPrompt} in ${selectedStyle.name} style`
        : currentPrompt;

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: finalPrompt,
          count: imageCount,
          size: selectedSize,
          referenceImage: referenceImage,
        }
      });

      if (error) throw error;

      const newImages: GeneratedImage[] = data.images.map((url: string, index: number) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt: finalPrompt,
        style: selectedStyle?.name,
        size: selectedSize.label,
        timestamp: new Date(),
      }));

      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { prompt: currentPrompt, status: "completed", images: newImages };
        return updated;
      });
      
      toast({
        title: "Success!",
        description: `Generated ${imageCount} image${imageCount > 1 ? 's' : ''}`,
      });

      setSelectedStyle(null);
      setReferenceImage(null);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      });
      // Remove the "creating" message on error
      setChatMessages(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const getSendIcon = () => {
    if (isGenerating) return <Loader2 className="w-5 h-5 animate-spin" />;
    if (prompt.trim()) return <Send className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const clearChat = () => {
    setChatMessages([]);
    setPrompt("");
    setSelectedStyle(null);
    setReferenceImage(null);
    toast({
      title: "Chat cleared",
      description: "All generated images have been removed",
    });
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <ConversationSidebar
          currentConversationId={currentConversationId}
          onConversationSelect={setCurrentConversationId}
          onNewChat={clearChat}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ChatHeader onClearChat={clearChat} />

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-60">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-3xl opacity-30 animate-pulse" />
                  <Sparkles className="h-24 w-24 relative text-primary animate-float" />
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
                  Create Amazing Images
                </h2>
                <p className="text-xl text-muted-foreground max-w-md">
                  Describe your vision and watch it come to life with AI
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6 py-6">
                {chatMessages.map((message, index) => (
                  <div key={index} className="space-y-4">
                    {/* User prompt message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl px-6 py-3 shadow-lg">
                        <p className="text-foreground">{message.prompt}</p>
                      </div>
                    </div>
                    
                    {/* Status or images */}
                    {message.status === "creating" ? (
                      <div className="flex items-center gap-3 text-muted-foreground pl-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium animate-pulse">Creating your image...</span>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : message.images ? (
                      <div className="space-y-4">
                        {message.images.map((image) => (
                          <ImageResult
                            key={image.id}
                            image={image}
                            onRegenerate={() => {
                              setPrompt(message.prompt);
                              handleGenerate();
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area - Floating */}
          <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
            <div className="max-w-4xl mx-auto space-y-4 pointer-events-auto">
              {/* Selected Style Display */}
              {selectedStyle && (
                <div className="flex items-center gap-2 px-4 py-2 bg-card/95 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 w-fit">
                  <Palette className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Style: {selectedStyle.name}</span>
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Reference Image Display */}
              {referenceImage && (
                <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-border/50 w-fit">
                  <div className="flex items-center gap-3">
                    <img
                      src={referenceImage}
                      alt="Reference"
                      className="h-16 w-16 object-cover rounded-xl border-2 border-primary/20"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">Reference Image</span>
                      <span className="text-xs text-muted-foreground">Will be used as inspiration</span>
                    </div>
                    <button
                      onClick={() => setReferenceImage(null)}
                      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Main Input Container */}
              <div className="flex items-end gap-3">
                {/* Plus Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 shrink-0"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowStyleSelector(true)}>
                      <Palette className="mr-2 h-4 w-4" />
                      Select Style
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSizeSelector(true)}>
                      <Grid3x3 className="mr-2 h-4 w-4" />
                      Size & Count
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Input Field */}
                <div className="flex-1 relative bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300">
                  <div className="flex items-end gap-2 p-3">
                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to create..."
                      className="flex-1 min-h-[56px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground/60 px-2"
                      disabled={isGenerating}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                    />
                    
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      size="icon"
                      className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent hover:shadow-2xl hover:scale-105 transition-all duration-300 shrink-0"
                    >
                      {getSendIcon()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Dialogs */}
      <StyleSelector
        open={showStyleSelector}
        onOpenChange={setShowStyleSelector}
        selectedStyle={selectedStyle}
        onStyleSelect={(style) => {
          setSelectedStyle(style);
          setShowStyleSelector(false);
        }}
      />

      <SizeSelector
        open={showSizeSelector}
        onOpenChange={setShowSizeSelector}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        imageCount={imageCount}
        onCountChange={setImageCount}
      />
    </SidebarProvider>
  );
};

export default Index;
