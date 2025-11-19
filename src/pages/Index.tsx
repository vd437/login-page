import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, ImagePlus, Sparkles, Loader2, X, Palette, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StyleSelector from "@/components/image-gen/StyleSelector";
import SizeSelector from "@/components/image-gen/SizeSelector";
import ImageResult from "@/components/image-gen/ImageResult";
import ChatHeader from "@/components/image-gen/ChatHeader";
import ConversationSidebar from "@/components/image-gen/ConversationSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImage } from "@/types/image";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; image: string } | null>(null);
  const [selectedSize, setSelectedSize] = useState({ width: 1024, height: 1024, label: "Square (1:1)" });
  const [imageCount, setImageCount] = useState(1);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
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

    setIsGenerating(true);
    
    try {
      const finalPrompt = selectedStyle 
        ? `${prompt} in ${selectedStyle.name} style`
        : prompt;

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

      setGeneratedImages(prev => [...newImages, ...prev]);
      
      toast({
        title: "Success!",
        description: `Generated ${imageCount} image${imageCount > 1 ? 's' : ''}`,
      });

      setPrompt("");
      setSelectedStyle(null);
      setReferenceImage(null);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      });
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
    setGeneratedImages([]);
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
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <ConversationSidebar
          currentConversationId={currentConversationId}
          onConversationSelect={setCurrentConversationId}
          onNewChat={clearChat}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ChatHeader
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onNewChat={clearChat}
            onClearChat={clearChat}
            conversationTitle="New Chat"
          />

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto">
            {generatedImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-foreground">
                  Create Amazing Images
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Describe what you want to create, choose a style, and let AI bring your imagination to life
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {generatedImages.map((image) => (
                  <ImageResult 
                    key={image.id} 
                    image={image} 
                    onRegenerate={() => {
                      setPrompt(image.prompt);
                      handleGenerate();
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border bg-background p-4">
            {/* Style and Image Preview */}
            {(selectedStyle || referenceImage) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedStyle && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
                    <Palette className="h-4 w-4" />
                    <span>{selectedStyle.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 hover:bg-transparent"
                      onClick={() => setSelectedStyle(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {referenceImage && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
                    <ImagePlus className="h-4 w-4" />
                    <span>Reference Image</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0 hover:bg-transparent"
                      onClick={() => setReferenceImage(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="min-h-[52px] max-h-32 resize-none pr-24"
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                
                {/* Plus Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-12 bottom-2 h-8 w-8"
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                >
                  <Plus className="h-5 w-5" />
                </Button>

                {/* Image Upload Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                >
                  <ImagePlus className="h-5 w-5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                size="icon"
                className="h-[52px] w-[52px] rounded-full"
              >
                {getSendIcon()}
              </Button>
            </div>

            {/* Plus Menu Popup */}
            {showPlusMenu && (
              <div className="absolute bottom-20 right-6 bg-card border border-border rounded-lg shadow-lg p-2 space-y-1 z-50">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowStyleSelector(true);
                    setShowPlusMenu(false);
                  }}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Style
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowSizeSelector(true);
                    setShowPlusMenu(false);
                  }}
                >
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Size & Count
                </Button>
              </div>
            )}
          </div>
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
