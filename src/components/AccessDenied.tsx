import React from "react";

interface AccessDeniedProps {
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You do not have permission to access this page.",
}) => {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {message}
      </div>
    </div>
  );
};

export default AccessDenied;