import { useState } from "react";
import type { DragEvent } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Linkedin,
  Upload,
  MapPin,
  Loader,
  CheckCircle,
} from "lucide-react";

import styles from "./Form.module.scss";
import { presign } from "../api/presign";
import { submitFounder } from "../api/founders";

/* =======================
   TYPES
======================= */

type FounderForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;

  company_name: string;
  company_url: string;
  company_linkedin: string;
  company_sharepoint: string;

  location_city: string;
  location_region: string;
  location_country: string;

  files: File[];
};

type Status = "idle" | "loading" | "success" | "error";

const TOTAL_STEPS = 2;

/* =======================
   COMPONENT
======================= */

export default function CreateFounder() {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Inline status (premium pattern)
  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState<string>("");

  const [form, setForm] = useState<FounderForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",

    company_name: "",
    company_url: "",
    company_linkedin: "",
    company_sharepoint: "",

    location_city: "",
    location_region: "",
    location_country: "",

    files: [],
  });

  function update<K extends keyof FounderForm>(key: K, value: FounderForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    update("files", [...form.files, ...Array.from(e.dataTransfer.files)]);
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    update("files", [...form.files, ...Array.from(files)]);
  }

  /* =======================
     SUBMIT
  ======================= */

  async function submit() {
    if (submitting) return;

    try {
      setSubmitting(true);
      setStatus("loading");
      setStatusText("Uploading files…");

      const uploadedFiles: {
        filename: string;
        s3_key: string;
        size: number;
        content_type: string;
      }[] = [];

      // 1️⃣ Upload files
      for (const file of form.files) {
        const { url, key } = await presign({
          method: "POST",
          key: `uploads/tmp/$${file.name}`,
          content_type: file.type || "application/octet-stream",
        });

        await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        uploadedFiles.push({
          filename: file.name,
          s3_key: key,
          size: file.size,
          content_type: file.type,
        });
      }

      // ✅ SUCCESS MESSAGE (files only)
      setStatus("success");
      setStatusText("Files uploaded successfully");

      // Small pause for visual confirmation
      await new Promise((r) => setTimeout(r, 1200));

      // Continue existing flow (unchanged)
      setStatus("loading");
      setStatusText("Submitting founder…");

      await submitFounder({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,

        company_name: form.company_name,
        company_url: form.company_url,
        company_linkedin: form.company_linkedin,
        company_sharepoint: form.company_sharepoint,

        location_city: form.location_city,
        location_region: form.location_region,
        location_country: form.location_country,

        files: uploadedFiles,
      });

      setStatus("success");
      setStatusText("Submitted successfully");

      setTimeout(() => {
        setStatus("idle");
        setStatusText("");
      }, 2500);
    } catch (err) {
      console.error("Submission failed:", err);
      setStatus("error");
      setStatusText("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  /* =======================
     RENDER
  ======================= */

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* PROGRESS */}
        <div className={styles.progressWrap}>
          <span className={styles.progressText}>
            Step {step} of {TOTAL_STEPS}
          </span>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.progressLabels}>
            <span className={step >= 1 ? styles.active : ""}>
              Personal details
            </span>
            <span className={step >= 2 ? styles.active : ""}>
              Company & Location
            </span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <section>
            <h2 className={styles.sectionTitle}>Personal details</h2>
            <p className={styles.sub}>Founder contact information</p>

            <div className={styles.row}>
              <FieldCard
                label="First name"
                icon={<User size={18} />}
                value={form.first_name}
                onChange={(v) => update("first_name", v)}
              />
              <FieldCard
                label="Last name"
                icon={<User size={18} />}
                value={form.last_name}
                onChange={(v) => update("last_name", v)}
              />
            </div>

            <FieldCard
              label="Email"
              icon={<Mail size={18} />}
              value={form.email}
              onChange={(v) => update("email", v)}
            />

            <FieldCard
              label="Phone number"
              icon={<Phone size={18} />}
              value={form.phone_number}
              onChange={(v) => update("phone_number", v)}
            />

            <Actions next={() => setStep(2)} />
          </section>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <section>
            <h2 className={styles.sectionTitle}>Company & Location</h2>
            <p className={styles.sub}>
              Business context, documents, and operating location
            </p>

            <div className={styles.row}>
              <div className={styles.column}>
                <FieldCard
                  label="Company name"
                  icon={<Building2 size={18} />}
                  value={form.company_name}
                  onChange={(v) => update("company_name", v)}
                />
                <FieldCard
                  label="Company website"
                  icon={<Globe size={18} />}
                  value={form.company_url}
                  onChange={(v) => update("company_url", v)}
                />
                <FieldCard
                  label="Company LinkedIn"
                  icon={<Linkedin size={18} />}
                  value={form.company_linkedin}
                  onChange={(v) => update("company_linkedin", v)}
                />
              </div>

              <div className={styles.column}>
                <FieldCard
                  label="City"
                  icon={<MapPin size={18} />}
                  value={form.location_city}
                  onChange={(v) => update("location_city", v)}
                />
                <FieldCard
                  label="State / Region"
                  icon={<MapPin size={18} />}
                  value={form.location_region}
                  onChange={(v) => update("location_region", v)}
                />
                <FieldCard
                  label="Country"
                  icon={<MapPin size={18} />}
                  value={form.location_country}
                  onChange={(v) => update("location_country", v)}
                />
              </div>
            </div>

            {/* FILE UPLOAD */}
            <div
              className={styles.dropzone}
              onClick={() => document.getElementById("fileInput")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload size={28} />
              <p>Click to upload or drag & drop</p>
              <span>Pitch decks, PDFs, financials</span>

              <input
                id="fileInput"
                type="file"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />

              {form.files.length > 0 && (
                <div className={styles.fileList}>
                  {form.files.map((f, i) => (
                    <div key={i} className={styles.fileItem}>
                      {f.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIONS + INLINE STATUS */}
            <div className={styles.actionsWrap}>
              <Actions
                back={() => setStep(1)}
                submit={submit}
                submitting={submitting}
              />

              {status !== "idle" && (
                <div className={`${styles.status} ${styles[status]}`}>
                  {status === "loading" && <Loader className={styles.loader} />}
                  {status === "success" && <CheckCircle size={16} />}
                  {statusText}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* =======================
   UI COMPONENTS
======================= */

function FieldCard({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldHeader}>
        {icon}
        <span>{label}</span>
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Actions({
  back,
  next,
  submit,
  submitting,
}: {
  back?: () => void;
  next?: () => void;
  submit?: () => void;
  submitting?: boolean;
}) {
  return (
    <div className={styles.actions}>
      {back && (
        <button className={styles.ghost} onClick={back}>
          Back
        </button>
      )}
      {next && <button onClick={next}>Next</button>}
      {submit && (
        <button
          onClick={submit}
          disabled={submitting}
          className={submitting ? styles.loading : ""}
        >
          {submitting ? (
            <>
              <Loader className={styles.loader} />
              <span className={styles.buttonLabel}>Submit</span>
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}
    </div>
  );
}
