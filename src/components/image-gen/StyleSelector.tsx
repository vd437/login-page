import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StyleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStyle: { name: string; image: string } | null;
  onStyleSelect: (style: { name: string; image: string }) => void;
}

const styles = [
  { name: "Realistic", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop" },
  { name: "Anime", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop" },
  { name: "Digital Art", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop" },
  { name: "Oil Painting", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop" },
  { name: "Watercolor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop" },
  { name: "Sketch", image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop" },
  { name: "3D Render", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop" },
  { name: "Cyberpunk", image: "https://images.unsplash.com/photo-1635236066444-e4d0fe6c4fc5?w=400&h=400&fit=crop" },
  { name: "Fantasy", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop" },
  { name: "Minimalist", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop" },
  { name: "Vintage", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400&h=400&fit=crop" },
  { name: "Neon", image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=400&fit=crop" },
  { name: "Comic Book", image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop" },
  { name: "Impressionist", image: "https://images.unsplash.com/photo-1577083553790-0a6ee8448ec3?w=400&h=400&fit=crop" },
  { name: "Abstract", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop" },
];

const StyleSelector = ({ open, onOpenChange, selectedStyle, onStyleSelect }: StyleSelectorProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select a Style</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-3 gap-4">
            {styles.map((style) => (
              <button
                key={style.name}
                onClick={() => {
                  onStyleSelect(style);
                  onOpenChange(false);
                }}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                  selectedStyle?.name === style.name
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <span className="text-white text-sm font-medium">{style.name}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StyleSelector;
