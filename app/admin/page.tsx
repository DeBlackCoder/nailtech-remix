import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
export const metadata: Metadata = { title: "Admin Dashboard — Nail Studio" };
export default function AdminPage() { return <AdminDashboardClient />; }
