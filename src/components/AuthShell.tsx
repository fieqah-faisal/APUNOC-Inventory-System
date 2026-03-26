import React from "react";
import AuthBrandPanel from "./AuthBrandPanel";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const AuthShell: React.FC<AuthShellProps> = ({
  title,
  subtitle,
  footer,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <AuthBrandPanel />

        <div className="flex w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Secure Access
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{title}</h1>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-8">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;