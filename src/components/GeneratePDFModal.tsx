import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import pdfAnim from "../assets/pdf.json";
import { generateOpportunityPdf } from "../api/founders";

import styles from "./GeneratePDFModal.module.scss";

type Props = {
  founder_id: number;
  onClose: () => void;
};

const STEPS = [
  "Analyzing Financial Data",
  "Building Report Pages",
  "Finalizing Report",
];

export default function GeneratePdfModal({ founder_id, onClose }: Props) {
  const [status, setStatus] = useState<"generating" | "done">("generating");
  const [stepIndex, setStepIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const stepTimer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 4000);

    async function generatePdf() {
      try {
        const res = await generateOpportunityPdf({ founder_id });

        if (cancelled) return;

        setFileName(res.file_name);

        if (res.pdf_url) {
          window.open(res.pdf_url, "_blank");
        }

        setStatus("done");

        setTimeout(() => {
          if (!cancelled) onClose();
        }, 2000);
      } catch (err) {
        console.error("PDF generation failed:", err);
        onClose();
      }
    }

    generatePdf();

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
  }, [founder_id, onClose]);

  return (
    <div className={styles.pdfModalOverlay}>
      <div className={styles.pdfModal}>
        <Lottie animationData={pdfAnim} loop className={styles.pdfModalAnim} />

        <h3 className={styles.pdfModalTitle}>
          Generating Due Diligence Report
        </h3>

        {status === "generating" && (
          <>
            <p className={styles.pdfModalStep}>{STEPS[stepIndex]}</p>

            <div className={styles.pdfModalProgressBar}>
              <div
                className={styles.pdfModalProgressFill}
                style={{
                  width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                }}
              />
            </div>
          </>
        )}

        {status === "done" && (
          <>
            <p className={styles.pdfModalDone}>Report Ready</p>
            {fileName && <p className={styles.pdfModalFileName}>{fileName}</p>}
          </>
        )}
      </div>
    </div>
  );
}
