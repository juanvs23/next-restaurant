"use client";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/useT";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export default function CreditNotesPage() {
  const { t } = useT();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/backoffice/credit-notes")
      .then((r) => r.json())
      .then(setNotes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">{t("common.loading")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="dashboard-heading text-3xl font-bold tracking-tight">{t("creditNotes.title")}</h1>

      <Card>
        <CardHeader><CardTitle>{t("creditNotes.allNotes")}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("creditNotes.originalInvoice")}</TableHead>
                <TableHead>{t("creditNotes.customer")}</TableHead>
                <TableHead className="text-right">{t("common.amount")}</TableHead>
                <TableHead>{t("creditNotes.reason")}</TableHead>
                <TableHead>{t("creditNotes.issuedBy")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {t("creditNotes.noNotes")}
                  </TableCell>
                </TableRow>
              ) : (
                notes.map((n: any) => (
                  <TableRow key={n._id}>
                    <TableCell className="font-mono text-xs">CN-{String(n.creditNoteNumber).padStart(5, "0")}</TableCell>
                    <TableCell className="text-sm">{new Date(n.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm font-mono"># INV-{String(n.originalInvoiceNumber || "").padStart(5, "0")}</TableCell>
                    <TableCell>{n.customerName}</TableCell>
                    <TableCell className="text-right text-red-500 font-medium">-${n.total.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{n.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{n.createdBy}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
