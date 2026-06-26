"use client";
import { useEffect, useState, useRef, DragEvent } from "react";
import { ImImages, ImCross, ImUpload } from "react-icons/im";
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

async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/backoffice/media", { method: "POST", body: formData });
    if (!res.ok) return null;
    const media = await res.json();
    return media.url;
  } catch {
    return null;
  }
}

export function MediaPicker({ value, onChange, label = "Image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      fetch("/api/backoffice/media").then((r) => r.json()).then(setItems);
    }
  }, [open]);

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    const url = await uploadFile(file);
    if (url) onChange(url);
    setUploading(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex gap-2 p-1 rounded-lg border-2 border-dashed transition-colors
          ${dragging ? "border-primary bg-primary/5" : "border-border"}
          ${value ? "border-solid" : ""}
        `}
      >
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={uploading ? "Uploading..." : "Drop image, paste URL, or select from library"}
            className="border-0 bg-transparent pl-2 pr-8 focus-visible:ring-0"
            disabled={uploading}
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ImCross className="w-3 h-3" />
            </button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} title="Select from media library">
          <ImImages className="w-4 h-4" />
        </Button>
      </div>

      {!value && !dragging && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ImUpload className="w-3 h-3" /> Drag & drop or paste URL
        </p>
      )}
      {dragging && (
        <p className="text-xs text-primary font-medium">Drop image here</p>
      )}

      {value && (
        <div className="relative w-24 h-24 group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover rounded border"
          />
          <button
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ImCross className="w-2.5 h-2.5" />
          </button>
        </div>
      )}

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
