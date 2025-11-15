import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, ImagePlus, Sparkles, Loader2, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StyleSelector from "@/components/image-gen/StyleSelector";
import SizeSelector from "@/components/image-gen/SizeSelector";
import ImageResult from "@/components/image-gen/ImageResult";
import ChatMenu from "@/components/image-gen/ChatMenu";
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
  const [showChatMenu, setShowChatMenu] = useState(false);
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">AI Image Generator</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowChatMenu(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {generatedImages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Create Your First Image</h2>
              <p className="text-muted-foreground max-w-sm">
                Describe what you want to see and our AI will bring it to life
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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

      {/* Input area */}
      <div className="border-t border-border/40 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Selected items display */}
        {(selectedStyle || referenceImage) && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {selectedStyle && (
              <div className="relative inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                <img
                  src={selectedStyle.image}
                  alt={selectedStyle.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm">{selectedStyle.name}</span>
                <button
                  onClick={() => setSelectedStyle(null)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )}
            {referenceImage && (
              <div className="relative inline-flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-sm">Reference Image</span>
                <button
                  onClick={() => setReferenceImage(null)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="min-h-[52px] max-h-32 resize-none pr-24"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="h-[52px] w-[52px]"
            size="icon"
          >
            {getSendIcon()}
          </Button>
        </div>

        {/* Plus menu dropdown */}
        {showPlusMenu && (
          <div className="mt-2 p-2 bg-muted rounded-lg space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setShowStyleSelector(true);
                setShowPlusMenu(false);
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Select Style
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setShowSizeSelector(true);
                setShowPlusMenu(false);
              }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              </svg>
              Image Size & Count
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <StyleSelector
        open={showStyleSelector}
        onOpenChange={setShowStyleSelector}
        selectedStyle={selectedStyle}
        onStyleSelect={setSelectedStyle}
      />

      <SizeSelector
        open={showSizeSelector}
        onOpenChange={setShowSizeSelector}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        imageCount={imageCount}
        onCountChange={setImageCount}
      />

      <ChatMenu
        open={showChatMenu}
        onOpenChange={setShowChatMenu}
        onClearChat={clearChat}
      />
    </div>
  );
};

export default Index;
