import { useState } from "react";
import { MoreVertical, Download, RefreshCw, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GeneratedImage } from "@/types/image";
import ImageViewer from "./ImageViewer";
import ReportDialog from "./ReportDialog";
import LoadingOverlay from "./LoadingOverlay";

interface ImageResultProps {
  image: GeneratedImage;
  onRegenerate: () => void;
}

const ImageResult = ({ image, onRegenerate }: ImageResultProps) => {
  const [showViewer, setShowViewer] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  });

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{image.prompt}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recreate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowReport(true)}>
              <Flag className="mr-2 h-4 w-4" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer group"
        onClick={() => setShowViewer(true)}
      >
        {isLoading && <LoadingOverlay progress={loadingProgress} />}
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-auto"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      <div className="flex gap-2 text-xs text-muted-foreground">
        {image.style && <span className="px-2 py-1 bg-muted rounded">{image.style}</span>}
        <span className="px-2 py-1 bg-muted rounded">{image.size}</span>
      </div>

      <ImageViewer
        open={showViewer}
        onOpenChange={setShowViewer}
        imageUrl={image.url}
      />

      <ReportDialog
        open={showReport}
        onOpenChange={setShowReport}
        imageId={image.id}
      />
    </div>
  );
};

export default ImageResult;
