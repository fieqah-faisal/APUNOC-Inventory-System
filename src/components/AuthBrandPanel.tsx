import React from "react";
import { Package, ShieldCheck, Boxes, ClipboardList } from "lucide-react";

const AuthBrandPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-l-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-10">
        <div>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">APU Technology Services</p>
              <h1 className="text-xl font-bold">NOC Inventory System</h1>
            </div>
          </div>

          <div className="mt-10 max-w-xl">
            <h2 className="text-4xl font-bold leading-tight">
              Centralized inventory and asset accountability for daily NOC operations
            </h2>
            <p className="mt-4 text-base leading-7 text-white/75">
              Manage assets, consumables, QC tool bags, movement logs, and operational accountability in one internal platform.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <ShieldCheck className="mb-3 h-6 w-6 text-indigo-200" />
              <h3 className="font-semibold">Role-Based Access</h3>
              <p className="mt-1 text-sm text-white/70">
                Controlled access for super admin, admin, and operator workflows.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Boxes className="mb-3 h-6 w-6 text-indigo-200" />
              <h3 className="font-semibold">Asset Visibility</h3>
              <p className="mt-1 text-sm text-white/70">
                Track devices, stock levels, and deployment locations across sites.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:col-span-2">
              <ClipboardList className="mb-3 h-6 w-6 text-indigo-200" />
              <h3 className="font-semibold">Operational Accountability</h3>
              <p className="mt-1 text-sm text-white/70">
                Support movement logs, QC tool bag tracking, and better traceability for field work.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/50">
          Internal platform for Network Operations Centre
        </p>
      </div>
    </div>
  );
};

export default AuthBrandPanel;