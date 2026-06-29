"use client";
import { useAppSelector } from "@/libs/store/hooks";
import { FaWineGlassAlt } from "react-icons/fa";
import jsPDF from "jspdf";

async function downloadTicket(data: any) {
  const tableName = data.table?.name || data.tableId?.name || "—";
  const date = new Date(data.dateTime).toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const id = data._id || "00000000";
  const shortId = id.slice(-8);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [100, 160] });

  // Golden border
  doc.setDrawColor(220, 202, 135);
  doc.setLineWidth(1.5);
  doc.rect(3, 3, 94, 154);

  // Header
  doc.setFontSize(14);
  doc.setTextColor(220, 202, 135);
  doc.setFont("helvetica", "bold");
  doc.text("GERÍCHT", 50, 18, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(170, 170, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Confirmación de reserva", 50, 24, { align: "center" });

  // Divider
  doc.setDrawColor(220, 202, 135);
  doc.setLineWidth(0.3);
  doc.line(10, 28, 90, 28);

  // Booking details
  doc.setFontSize(8);
  let y = 36;
  const lineHeight = 6;

  const fields = [
    { label: "Nombre", value: `${data.firstName} ${data.lastName}` },
    { label: "Correo", value: data.email },
    { label: "Fecha", value: date },
    { label: "Hora", value: data.turnTime.charAt(0).toUpperCase() + data.turnTime.slice(1) },
    { label: "Comensales", value: String(data.numberPersons) },
    { label: "Mesa", value: tableName },
    { label: "Código", value: `#${shortId}` },
  ];

  fields.forEach((f) => {
    doc.setTextColor(220, 202, 135);
    doc.setFont("helvetica", "bold");
    doc.text(`${f.label}:`, 12, y);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(f.value, 45, y);
    y += lineHeight;
  });

  // QR Code
  const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}`;

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const imgPromise = new Promise<void>((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 34, y + 5, 32, 32);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = qrUrl;
    });
    await imgPromise;
  } catch {
    // QR code failed to load — continue without it
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text("Gracias por elegir GERÍCHT", 50, y + 45, { align: "center" });

  doc.save(`gericht-booking-${id}.pdf`);
}

export default function ResponseInfo() {
  const { response, loading } = useAppSelector((state) => state.booking);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-golden border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white">Procesando tu reserva...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center py-8">
        <p className="text-white2">No hay datos de reserva.</p>
      </div>
    );
  }

  const resp = response as any;
  const isError = resp.status === 400 || resp.error;

  if (isError) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-red-500 text-5xl mb-2">✕</div>
        <h2 className="text-red-500 text-2xl">Reserva fallida</h2>
        <p className="text-white2">{resp.error || "Intenta de nuevo."}</p>
      </div>
    );
  }

  const tableName = resp.table?.name || resp.tableId?.name;

  return (
    <div className="text-center space-y-6 py-4">
      <div className="flex justify-center text-golden">
        <FaWineGlassAlt size={64} />
      </div>

      <div>
        <h2 className="text-golden text-2xl font-serif">Cheers!</h2>
        <p className="text-white2 mt-1">Tu mesa está reservada</p>
      </div>

      <div className="bg-black/50 border border-golden/20 rounded-lg p-5 text-left max-w-sm mx-auto space-y-2">
        <p className="text-white">
          <span className="text-golden">Nombre:</span> {resp.firstName} {resp.lastName}
        </p>
        <p className="text-white">
          <span className="text-golden">Fecha:</span>{" "}
          {new Date(resp.dateTime).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-white">
          <span className="text-golden">Hora:</span>{" "}
          <span className="capitalize">{resp.turnTime}</span>
        </p>
        <p className="text-white">
          <span className="text-golden">Comensales:</span> {resp.numberPersons}
        </p>
        {tableName && (
          <p className="text-white">
            <span className="text-golden">Mesa:</span> {tableName}
          </p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => downloadTicket(resp)}
          className="button inline-flex ticket-button items-center gap-2 whitespace-nowrap"
        >
          <span className="flex justify-center  items-center gap-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar ticket
          </span>
        </button>
      </div>
    </div>
  );
}
