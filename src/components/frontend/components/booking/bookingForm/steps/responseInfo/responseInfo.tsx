"use client";
import { useAppSelector } from "@/libs/store/hooks";
import { FaWineGlassAlt } from "react-icons/fa";
import jsPDF from "jspdf";

async function downloadTicket(data: any) {
  const tableName = data.table?.name || data.tableId?.name || "—";
  const date = new Date(data.dateTime).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const id = data._id?.slice(-8) || "00000000";

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 140] });

  // Golden border
  doc.setDrawColor(220, 202, 135);
  doc.setLineWidth(1.5);
  doc.rect(3, 3, 74, 134);

  // Header
  doc.setFontSize(14);
  doc.setTextColor(220, 202, 135);
  doc.setFont("helvetica", "bold");
  doc.text("GERÍCHT", 40, 18, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(170, 170, 170);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Confirmation", 40, 24, { align: "center" });

  // Divider
  doc.setDrawColor(220, 202, 135);
  doc.setLineWidth(0.3);
  doc.line(10, 28, 70, 28);

  // Booking details
  doc.setFontSize(7);
  let y = 36;
  const lineHeight = 5.5;

  const fields = [
    { label: "Name", value: `${data.firstName} ${data.lastName}` },
    { label: "Email", value: data.email },
    { label: "Date", value: date },
    { label: "Time", value: data.turnTime.charAt(0).toUpperCase() + data.turnTime.slice(1) },
    { label: "Guests", value: String(data.numberPersons) },
    { label: "Table", value: tableName },
    { label: "Code", value: `#${id}` },
  ];

  fields.forEach((f) => {
    doc.setTextColor(220, 202, 135);
    doc.setFont("helvetica", "bold");
    doc.text(`${f.label}:`, 10, y);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.text(f.value, 40, y);
    y += lineHeight;
  });

  // QR Code
  const qrData = `https://restaurant.gericht/booking/${id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}`;

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const imgPromise = new Promise<void>((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 24, y + 5, 32, 32);
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
  doc.setFontSize(6);
  doc.setTextColor(170, 170, 170);
  doc.text("Thank you for choosing GERÍCHT", 40, y + 45, { align: "center" });

  doc.save(`gericht-booking-${id}.pdf`);
}

export default function ResponseInfo() {
  const { response, loading } = useAppSelector((state) => state.booking);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-2 border-golden border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white">Processing your booking...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center py-8">
        <p className="text-white2">No booking data available.</p>
      </div>
    );
  }

  const resp = response as any;
  const isError = resp.status === 400 || resp.error;

  if (isError) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-red-500 text-5xl mb-2">✕</div>
        <h2 className="text-red-500 text-2xl">Booking Failed</h2>
        <p className="text-white2">{resp.error || "Please try again."}</p>
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
        <p className="text-white2 mt-1">Your table is reserved</p>
      </div>

      <div className="bg-black/50 border border-golden/20 rounded-lg p-5 text-left max-w-sm mx-auto space-y-2">
        <p className="text-white">
          <span className="text-golden">Name:</span> {resp.firstName} {resp.lastName}
        </p>
        <p className="text-white">
          <span className="text-golden">Date:</span>{" "}
          {new Date(resp.dateTime).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-white">
          <span className="text-golden">Time:</span>{" "}
          <span className="capitalize">{resp.turnTime}</span>
        </p>
        <p className="text-white">
          <span className="text-golden">Guests:</span> {resp.numberPersons}
        </p>
        {tableName && (
          <p className="text-white">
            <span className="text-golden">Table:</span> {tableName}
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
            Download Ticket
          </span>
        </button>
      </div>
    </div>
  );
}
