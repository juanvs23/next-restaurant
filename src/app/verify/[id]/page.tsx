import { connectDB } from "@/database/connection";
import { Booking } from "@/database/models/booking";
import { notFound } from "next/navigation";

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectDB();
  const booking = await Booking.findById(id).populate("tableId").lean();

  if (!booking) notFound();

  const b = booking as any;
  const now = new Date();
  const bookingDate = new Date(b.dateTime);
  const isExpired = bookingDate < now;
  const isActive = !isExpired && b.status === "confirmed";
  const tableName = (b.tableId as any)?.name || "—";

  return (
    <main className="min-h-screen bg-black2 flex items-center justify-center p-4">
      <div className="bg-black border border-golden/30 rounded-xl p-8 max-w-sm w-full text-center space-y-6">

        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isActive ? "bg-green-500/20" : isExpired ? "bg-red-500/20" : "bg-golden/20"}`}>
          {isActive ? (
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-serif text-golden">GERÍCHT</h1>
          <p className="text-white2 text-sm mt-1">Ticket Verification</p>
        </div>

        {isActive ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg py-2 px-4">
            <p className="text-green-500 font-bold">✓ Valid Ticket</p>
          </div>
        ) : isExpired ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg py-2 px-4">
            <p className="text-red-500 font-bold">✕ Expired</p>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg py-2 px-4">
            <p className="text-yellow-500 font-bold">— {b.status}</p>
          </div>
        )}

        <div className="border-t border-golden/20 pt-4 text-left space-y-2 text-sm">
          <p className="text-white2">
            <span className="text-golden">Guest:</span>{" "}
            <span className="text-white">{b.firstName} {b.lastName}</span>
          </p>
          <p className="text-white2">
            <span className="text-golden">Date:</span>{" "}
            <span className="text-white">{bookingDate.toLocaleDateString()}</span>
          </p>
          <p className="text-white2">
            <span className="text-golden">Time:</span>{" "}
            <span className="text-white capitalize">{b.turnTime}</span>
          </p>
          <p className="text-white2">
            <span className="text-golden">Guests:</span>{" "}
            <span className="text-white">{b.numberPersons}</span>
          </p>
          <p className="text-white2">
            <span className="text-golden">Table:</span>{" "}
            <span className="text-white">{tableName}</span>
          </p>
        </div>

        <p className="text-white2 text-xs">
          Ticket ID: <span className="text-white">{id.slice(-8)}</span>
        </p>
      </div>
    </main>
  );
}
