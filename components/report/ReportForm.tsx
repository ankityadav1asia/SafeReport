"use client";

import { useState, useCallback } from "react";
import { LocationInput } from "./LocationInput";
import crypto from "crypto";

const REPORT_TYPES = [
  "Theft",
  "Fire Outbreak",
  "Medical Emergency",
  "Natural Disaster",
  "Violence",
  "Other",
] as const;

type ReportType = "EMERGENCY" | "NON_EMERGENCY";

interface ReportFormData {
  incidentType: ReportType;
  specificType: string;
  location: string;
  description: string;
  title: string;
}

interface SubmitResult {
  reportId: string;
}

interface ReportFormProps {
  onComplete: (data: SubmitResult) => void;
}

export function ReportForm({ onComplete }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    incidentType: "NON_EMERGENCY",
    specificType: "",
    location: "",
    description: "",
    title: "",
  });

  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data: {
        title?: string;
        description?: string;
        reportType?: string;
      } = await response.json();

      if (data.title && data.description && data.reportType) {
        setFormData((prev) => ({
          ...prev,
          title: data.title,
          description: data.description,
          specificType: data.reportType,
        }));
        setImage(base64);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReportId = useCallback(() => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const combinedString = `${timestamp}-${randomBytes}`;
    return crypto
      .createHash("sha256")
      .update(combinedString)
      .digest("hex")
      .slice(0, 16);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        reportId: generateReportId(),
        type: formData.incidentType,
        specificType: formData.specificType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        image,
        status: "PENDING",
      };

      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const result: SubmitResult & { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      onComplete(result);
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* your JSX below remains unchanged */}
      {/* nothing else needed for ESLint */}
    </form>
  );
}
