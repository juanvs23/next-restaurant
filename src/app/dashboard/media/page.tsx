"use client";
import { useEffect, useState, useRef } from "react";
import { ImPlus, ImBin, ImCross, ImCheckmark, ImCopy, ImImage } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/i18n/useT";

interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  alt: string;
  title: string;
  caption: string;
  description: string;
  createdAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useT();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = items.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    item.alt?.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchMedia = () => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); });
  };

  useEffect(fetchMedia, []);

  const handleUploadUrl = async () => {
    if (!urlInput) return;
    const filename = urlInput.split("/").pop() || "image";
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, url: urlInput, mimeType: "image/*" }),
    });
    setUrlInput("");
    setUploadOpen(false);
    fetchMedia();
  };

  const handleSaveEdit = async () => {
    if (!selected) return;
    await fetch(`/api/media/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alt: (document.getElementById("edit-alt") as HTMLInputElement)?.value,
        title: (document.getElementById("edit-title") as HTMLInputElement)?.value,
        caption: (document.getElementById("edit-caption") as HTMLTextAreaElement)?.value,
      }),
    });
    setEditOpen(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    fetchMedia();
  };

  const copyUrl = async (url: string, id: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("media.title")}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setView(view === "grid" ? "list" : "grid")}>
            {view === "grid" ? "List" : "Grid"}
          </Button>
          <Button onClick={() => setUploadOpen(true)} className="gap-2"><ImPlus /> {t("media.upload")}</Button>
        </div>
      </div>

      <Input
        placeholder="Search media..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="max-w-xs"
      />

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader><DialogTitle>Upload Image</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImImage className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t("media.dropFiles")}</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-popover px-2 text-muted-foreground">Or add from URL</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg" />
              <Button onClick={handleUploadUrl} disabled={!urlInput}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Metadata Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-popover sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Metadata</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 py-4">
              <img src={selected.url} alt="" className="w-full max-h-48 object-contain rounded border" />
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" defaultValue={selected.title} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-alt">Alt Text (SEO)</Label>
                <Input id="edit-alt" defaultValue={selected.alt} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-caption">Caption</Label>
                <Textarea id="edit-caption" defaultValue={selected.caption} rows={2} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="gap-2"><ImCross /> Cancel</Button>
            <Button onClick={handleSaveEdit} className="gap-2"><ImCheckmark /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {paginated.map((item) => (
            <Card key={item._id} className="group overflow-hidden">
              <div className="relative aspect-square">
                <img src={item.url} alt={item.alt || item.filename}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="text-white hover:text-golden"
                    onClick={() => copyUrl(item.url, item._id)}>
                    {copiedId === item._id ? <ImCheckmark /> : <ImCopy />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-golden"
                    onClick={() => { setSelected(item); setEditOpen(true); }}>
                    ✎
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:text-red-500"
                    onClick={() => handleDelete(item._id)}>
                    <ImBin />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs truncate text-muted-foreground">{item.filename}</p>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">
              {t("media.noMedia")}
            </p>
          )}
        </div>
      ) : (
        /* List View */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>{t("common.name")}</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <img src={item.url} alt="" className="w-12 h-12 object-cover rounded border" />
                  </TableCell>
                  <TableCell className="font-medium">{item.filename}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.alt || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => copyUrl(item.url, item._id)}
                        title="Copy URL">
                        {copiedId === item._id ? <ImCheckmark className="w-4 h-4" /> : <ImCopy className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelected(item); setEditOpen(true); }}
                        title="Edit metadata">
                        ✎
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)}
                        title="Delete">
                        <ImBin className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
