"use client";
import { useEffect, useState } from "react";
import { ImImages, ImCross } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  alt: string;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label = "Image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/media").then((r) => r.json()).then(setItems);
    }
  }, [open]);

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or select from library"
            className="pr-10"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ImCross className="w-3 h-3" />
            </button>
          )}
        </div>
        <Button variant="outline" onClick={() => setOpen(true)} title="Select from media library">
          <ImImages className="w-4 h-4" />
        </Button>
      </div>

      {value && (
        <img
          src={value}
          alt="Preview"
          className="w-20 h-20 object-cover rounded border mt-1"
        />
      )}

      {/* Media Library Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-popover sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Select Image</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 py-4">
            {items.map((item) => (
              <Card
                key={item._id}
                className={`cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all ${
                  value === item.url ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => { onChange(item.url); setOpen(false); }}
              >
                <div className="aspect-square">
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-1.5">
                  <p className="text-xs truncate text-muted-foreground">{item.filename}</p>
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8">
                No images in library.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
