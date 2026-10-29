import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandMark } from "@/components/brand/brand-mark";

export const metadata = {
  title: "Admin Login — Viruksham Estates",
  description: "Secure administrator access portal for Viruksham Estates.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f9f2] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center"><BrandMark /></div>
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto rounded-xl border border-stone-200 bg-white p-8 text-center text-xs text-stone-500">
            Loading authentication portal...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
