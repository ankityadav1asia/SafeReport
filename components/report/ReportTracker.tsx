"use client";

import { useState } from "react";

export function ReportTracker() {
  const [reportId, setReportId] = useState("");

  return (
    <div className="max-w-md mx-auto bg-zinc-900/50 border border-white/5 p-6 rounded-xl">
      <h2 className="text-xl text-white mb-4">Track Your Report</h2>

      <input
        value={reportId}
        onChange={(e) => setReportId(e.target.value)}
        placeholder="Enter Report ID"
        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white"
      />
    </div>
  );
}
