"use client";
import { useAppSelector } from "@/libs/store/hooks";

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
  const tableName = resp.table?.name || resp.tableId?.name;

  return (
    <div className="text-white text-center space-y-4 py-4">
      {isError ? (
        <>
          <div className="text-red-500 text-5xl mb-2">✕</div>
          <h2 className="text-red-500 text-2xl">Booking Failed</h2>
          <p className="text-white2">{resp.error || "Please try again."}</p>
        </>
      ) : (
        <>
          <div className="text-golden text-5xl mb-2">✓</div>
          <h2 className="text-golden text-2xl">Booking Confirmed!</h2>
          <div className="bg-black/50 border border-golden/20 rounded-lg p-4 text-left space-y-2">
            <p><span className="text-golden">Name:</span> {resp.firstName} {resp.lastName}</p>
            <p><span className="text-golden">Date:</span> {new Date(resp.dateTime).toLocaleDateString()}</p>
            <p><span className="text-golden">Turn:</span> <span className="capitalize">{resp.turnTime}</span></p>
            <p><span className="text-golden">Guests:</span> {resp.numberPersons}</p>
            {tableName && <p><span className="text-golden">Table:</span> {tableName}</p>}
            <p><span className="text-golden">Status:</span> <span className="capitalize text-green-500">{resp.status}</span></p>
          </div>
        </>
      )}
    </div>
  );
}
