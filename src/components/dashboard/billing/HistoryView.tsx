"use client";
import { ImCheckmark, ImCross } from "react-icons/im";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useT } from "@/i18n/useT";

interface HistoryViewProps {
  orders: any[];
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  paginated: any[];
  closedDays: any[];
  hDateFrom: string;
  setHDateFrom: (s: string) => void;
  hDateTo: string;
  setHDateTo: (s: string) => void;
  hSearch: string;
  setHSearch: (s: string) => void;
  hInvNum: string;
  setHInvNum: (s: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onDetail: (order: any) => void;
}

export default function HistoryView({
  orders,
  page,
  setPage,
  totalPages,
  paginated,
  hDateFrom,
  setHDateFrom,
  hDateTo,
  setHDateTo,
  hSearch,
  setHSearch,
  hInvNum,
  setHInvNum,
  onSearch,
  onReset,
  onDetail,
}: HistoryViewProps) {
  const { t } = useT();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="grid gap-1">
              <Label className="text-xs">
                {t("reports.dateFrom") || "From"}
              </Label>
              <Input
                type="date"
                value={hDateFrom}
                onChange={(e) => setHDateFrom(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">{t("reports.dateTo") || "To"}</Label>
              <Input
                type="date"
                value={hDateTo}
                onChange={(e) => setHDateTo(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">{t("billing.customer")}</Label>
              <Input
                placeholder={t("common.search")}
                value={hSearch}
                onChange={(e) => setHSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="grid gap-1">
              <Label className="text-xs">
                # {t("creditNotes.originalInvoice")}
              </Label>
              <Input
                placeholder="12345"
                value={hInvNum}
                onChange={(e) => setHInvNum(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={onSearch} className="gap-1">
              <ImCheckmark className="w-3 h-3" /> {t("common.search")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="gap-1"
            >
              <ImCross className="w-3 h-3" /> {t("common.reset") || "Reset"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>{t("common.date")}</TableHead>
                <TableHead>{t("billing.customer")}</TableHead>
                <TableHead>{t("billing.paymentMethod")}</TableHead>
                <TableHead className="text-right">{t("billing.total")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell className="font-mono text-xs">
                      # INV-
                      {String(o.invoiceNumber || "").padStart(5, "0")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {o.customer?.name || t("billing.walkIn")}
                    </TableCell>
                    <TableCell>{o.paymentMethod}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${o.total?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${o.status === "paid"
                            ? "bg-green-500/10 text-green-500"
                            : o.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                      >
                        {o.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => onDetail(o)}
                      >
                        {t("billing.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {orders.length} {t("billing.bills")}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
