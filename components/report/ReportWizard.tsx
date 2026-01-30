"use client";

import { useState } from "react";
import { ReportForm } from "./ReportForm";
import { ReportSubmitted } from "./ReportFormCompleted";

type ReportData = {
  reportId?: string;
  title?: string;
  description?: string;
  location?: string;
  incidentType?: string;
};

export function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const handleStepComplete = async (data: Partial<ReportData>) => {
    setReportData((prev) => ({ ...prev, ...data }));

    if (currentStep === 4) return;
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="rounded-2xl bg-zinc-900 p-8">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && (
        <ReportSubmitted data={reportData} onComplete={handleStepComplete} />
      )}
    </div>
  );
}
