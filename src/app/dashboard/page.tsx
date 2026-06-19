"use client";
import { useSession } from "next-auth/react";

export default function DashboardHome() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-3xl text-white mb-6">Dashboard</h1>
      <p className="text-white2 mb-4">
        Welcome{session?.user?.name ? `, ${session.user.name}` : ""}!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black/50 border border-golden/20 rounded-lg p-6">
          <h2 className="text-golden text-xl mb-2">Products</h2>
          <p className="text-white2">Manage your menu items</p>
        </div>
        <div className="bg-black/50 border border-golden/20 rounded-lg p-6">
          <h2 className="text-golden text-xl mb-2">Bookings</h2>
          <p className="text-white2">View reservations</p>
        </div>
        <div className="bg-black/50 border border-golden/20 rounded-lg p-6">
          <h2 className="text-golden text-xl mb-2">Users</h2>
          <p className="text-white2">Manage staff accounts</p>
        </div>
      </div>
    </div>
  );
}
