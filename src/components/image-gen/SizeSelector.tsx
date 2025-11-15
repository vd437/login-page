import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SizeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSize: { width: number; height: number; label: string };
  onSizeSelect: (size: { width: number; height: number; label: string }) => void;
  imageCount: number;
  onCountChange: (count: number) => void;
}

const sizes = [
  { width: 1024, height: 1024, label: "Square (1:1)", aspect: "1:1" },
  { width: 1024, height: 1792, label: "Portrait (9:16)", aspect: "9:16" },
  { width: 1792, height: 1024, label: "Landscape (16:9)", aspect: "16:9" },
  { width: 1536, height: 1024, label: "Wide (3:2)", aspect: "3:2" },
];

const SizeSelector = ({
  open,
  onOpenChange,
  selectedSize,
  onSizeSelect,
  imageCount,
  onCountChange,
}: SizeSelectorProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Image Size & Count</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Size selection */}
          <div className="space-y-3">
            <Label>Image Size</Label>
            <div className="grid grid-cols-2 gap-4">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => {
                    onSizeSelect(size);
                  }}
                  className={`group relative overflow-hidden rounded-lg border-2 p-4 transition-all ${
                    selectedSize.label === size.label
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center w-20 h-20 bg-muted rounded">
                      <div
                        className="bg-primary/20 rounded-sm border border-primary/40"
                        style={{
                          width: size.width > size.height ? "70%" : size.width === size.height ? "60%" : "40%",
                          height: size.height > size.width ? "70%" : size.width === size.height ? "60%" : "40%",
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{size.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {size.width} × {size.height}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Ratio: {size.aspect}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Count selection */}
          <div className="space-y-3">
            <Label>Number of Images</Label>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => onCountChange(count)}
                  className={`py-3 rounded-lg border-2 font-medium transition-all ${
                    imageCount === count
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeSelector;
