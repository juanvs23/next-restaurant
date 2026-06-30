"use client";
import { useEffect, useState, useRef, DragEvent } from "react";
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

interface MediaCategory {
  _id: string;
  name: string;
  slug: string;
}

interface MediaItem {
  _id: string;
  filename: string;
  url: string;
  mimeType: string;
  alt: string;
  title: string;
  caption: string;
  description: string;
  categories: string[];
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
  const [dragging, setDragging] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [categories, setCategories] = useState<MediaCategory[]>([]);

  // Upload state
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategoryIds, setUploadCategoryIds] = useState<string[]>([]);
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  const fetchCategories = () => {
    fetch("/api/backoffice/media-categories")
      .then(r => r.json())
      .then(setCategories);
  };

  const createCat = async () => {
    const name = newCatName.trim();
    if (!name) return;
    await fetch("/api/backoffice/media-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setNewCatName("");
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Images will keep their other categories.")) return;
    await fetch(`/api/backoffice/media-categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const startEdit = (cat: MediaCategory) => {
    setEditingCat(cat._id);
    setEditingCatName(cat.name);
  };

  const saveEdit = async (id: string) => {
    const name = editingCatName.trim();
    if (!name) return;
    await fetch(`/api/backoffice/media-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setEditingCat(null);
    fetchCategories();
  };

  const countForCategory = (catId: string) =>
    items.filter((i) => i.categories?.includes(catId)).length;

  const createCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const res = await fetch("/api/backoffice/media-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const cat = await res.json();
    if (cat._id) {
      setCategories(prev => [...prev, cat]);
      setUploadCategoryIds(prev => [...prev, cat._id]);
      setEditCategoryIds(prev => [...prev, cat._id]);
      setNewCategoryName("");
    }
  };

  const toggleUploadCategory = (id: string) => {
    setUploadCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleEditCategory = (id: string) => {
    setEditCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const uploadFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", uploadAlt);
      formData.append("title", uploadTitle);
      formData.append("caption", uploadCaption);
      formData.append("description", uploadDescription);
      formData.append("categories", JSON.stringify(uploadCategoryIds));
      await fetch("/api/backoffice/media", { method: "POST", body: formData });
    }
    setUploadAlt(""); setUploadTitle(""); setUploadCaption("");
    setUploadDescription(""); setUploadCategoryIds([]);
    setUploadOpen(false);
    fetchMedia();
  };

  const filtered = items.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    item.alt?.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const fetchMedia = () => {
    fetch("/api/backoffice/media")
      .then((r) => r.json())
      .then((d) => { setItems(d); setLoading(false); });
  };

  useEffect(() => { fetchMedia(); fetchCategories(); }, []);

  const handleUploadUrl = async () => {
    if (!urlInput) return;
    const filename = urlInput.split("/").pop() || "image";
    await fetch("/api/backoffice/media", {
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
    await fetch(`/api/backoffice/media/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alt: (document.getElementById("edit-alt") as HTMLInputElement)?.value,
        title: (document.getElementById("edit-title") as HTMLInputElement)?.value,
        caption: (document.getElementById("edit-caption") as HTMLTextAreaElement)?.value,
        categories: editCategoryIds,
      }),
    });
    setEditOpen(false);
    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/backoffice/media/${id}`, { method: "DELETE" });
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
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e: DragEvent) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={async (e: DragEvent) => {
                e.preventDefault();
                setDragging(false);
                const files = e.dataTransfer?.files;
                if (!files?.length) return;
                await uploadFiles(files);
              }}
            >
              <ImImage className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t("media.dropFiles")}</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" multiple
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files?.length) return;
                  await uploadFiles(files);
                }}
              />
            </div>

            {/* Metadata fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="upload-title" className="text-xs">Title</Label>
                <Input id="upload-title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Image title" />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="upload-alt" className="text-xs">Alt Text (SEO)</Label>
                <Input id="upload-alt" value={uploadAlt} onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Describe the image" />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="upload-caption" className="text-xs">Caption</Label>
                <Input id="upload-caption" value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Short caption" />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="upload-desc" className="text-xs">Description</Label>
              <Textarea id="upload-desc" value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Longer description..." rows={2} />
            </div>

            {/* Categories */}
            <div className="grid gap-1">
              <Label className="text-xs">Categories</Label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => toggleUploadCategory(cat._id)}
                    className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                      uploadCategoryIds.includes(cat._id)
                        ? "bg-golden/20 border-golden text-golden"
                        : "bg-white2/5 border-white2/10 text-white2/60 hover:border-white2/30"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category..."
                  className="text-xs h-8"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createCategory(); } }}
                />
                <Button type="button" size="sm" variant="outline" onClick={createCategory}
                  disabled={!newCategoryName.trim()}
                  className="text-xs h-8">
                  + Add
                </Button>
              </div>
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

              {/* Categories */}
              <div className="grid gap-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleEditCategory(cat._id)}
                      className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                        editCategoryIds.includes(cat._id)
                          ? "bg-golden/20 border-golden text-golden"
                          : "bg-white2/5 border-white2/10 text-white2/60 hover:border-white2/30"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category..."
                    className="text-xs h-8"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createCategory(); } }}
                  />
                  <Button type="button" size="sm" variant="outline" onClick={createCategory}
                    disabled={!newCategoryName.trim()}
                    className="text-xs h-8">
                    + Add
                  </Button>
                </div>
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
                    onClick={() => { setSelected(item); setEditCategoryIds(item.categories || []); setEditOpen(true); }}>
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

      {/* ── Categories Management ── */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="flex gap-2">
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category name..."
                className="text-sm h-8 w-48"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); createCat(); } }}
              />
              <Button size="sm" onClick={createCat} disabled={!newCatName.trim()}>
                <ImPlus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between rounded-lg border border-white2/10 bg-white2/5 px-3 py-2"
                >
                  {editingCat === cat._id ? (
                    <input
                      autoFocus
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                      onBlur={() => saveEdit(cat._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(cat._id);
                        if (e.key === "Escape") setEditingCat(null);
                      }}
                      className="text-sm bg-transparent border-b border-golden outline-none flex-1 mr-2"
                    />
                  ) : (
                    <span
                      className="text-sm cursor-pointer hover:text-golden flex-1"
                      onClick={() => startEdit(cat)}
                      title="Click to edit"
                    >
                      {cat.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({countForCategory(cat._id)})
                      </span>
                    </span>
                  )}
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="text-white2/30 hover:text-red-400 transition-colors ml-2"
                    title="Delete category"
                  >
                    <ImBin className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
