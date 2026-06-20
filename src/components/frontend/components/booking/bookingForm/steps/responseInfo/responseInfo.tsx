"use client";
import { useAppSelector } from "@/libs/store/hooks";

function WineGlassSvg() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26 8h28l-6 32a8 8 0 0 1-16 0L26 8z" stroke="#DCCA87" strokeWidth="2" fill="none"/>
      <path d="M34 56v12m12-12v12" stroke="#DCCA87" strokeWidth="2"/>
      <path d="M30 68h20" stroke="#DCCA87" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 8h32" stroke="#DCCA87" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function downloadTicket(data: any) {
  const tableName = data.table?.name || data.tableId?.name || "—";
  const date = new Date(data.dateTime).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const ticket = `
╔══════════════════════════╗
║    GERÍCHT - RESTAURANT   ║
║    Booking Confirmation   ║
╠══════════════════════════╣
║                           ║
║  Guest: ${data.firstName} ${data.lastName}
║  Email: ${data.email}
║  Date:  ${date}
║  Turn:  ${data.turnTime}
║  Guests: ${data.numberPersons}
║  Table: ${tableName}
║                           ║
╚══════════════════════════╝
`;

  const blob = new Blob([ticket], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gericht-booking-${data._id?.slice(-6) || "confirmation"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
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
      <div className="flex justify-center">
        <WineGlassSvg />
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

      <button
        onClick={() => downloadTicket(resp)}
        className="button inline-flex items-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download Ticket
      </button>
    </div>
  );
}
