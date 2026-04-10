import { useState } from "react";
import type {
  DragEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  ShieldCheck,
  Clock3,
  FileText,
  X,
} from "lucide-react";

import styles from "./Form.module.scss";
import NdaModal from "../components/NdaModal";
import { presign } from "../api/presign";
import { submitFounder } from "../api/founders";
import logo from "../assets/logo.png";

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
const ACCEPTED_FILE_TYPES =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";
const stepLabels = ["Founder profile", "Company context"];

export default function CreateFounder() {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [showNdaModal, setShowNdaModal] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);

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

  function removeFile(index: number) {
    update(
      "files",
      form.files.filter((_, fileIndex) => fileIndex !== index),
    );
  }

  function goNext() {
    if (!form.first_name || !form.last_name || !form.email) {
      setFormError("Please add the founder's name and email to continue.");
      return;
    }

    setFormError("");
    setStep(2);
  }

  async function submit() {
    if (submitting) return;

    if (!ndaAccepted) {
      setShowNdaModal(true);
      setStatus("error");
      setStatusText("Please review and accept the NDA before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("loading");
      setStatusText(
        form.files.length ? "Uploading documents..." : "Preparing submission...",
      );

      const uploadedFiles: {
        filename: string;
        s3_key: string;
        size: number;
        content_type: string;
      }[] = [];

      for (const file of form.files) {
        const { url, key } = await presign({
          method: "POST",
          key: `uploads/tmp/${file.name}`,
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

      if (form.files.length) {
        setStatus("success");
        setStatusText("Documents uploaded successfully");
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setStatus("loading");
      setStatusText("Submitting founder profile...");

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

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.introPanel}>
          <div className={styles.brand}>
            <img src={logo} alt="Lotus Domaine" />
            <span>Lotus Domaine DDC</span>
          </div>

          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Founder intake</span>
            <h1>Share your company details securely.</h1>
            <p>
              This short form helps our diligence team prepare your founder
              profile, organize supporting documents, and move your review
              forward with the right context.
            </p>
          </div>

          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <ShieldCheck size={18} />
              <span>Secure upload path</span>
            </div>
            <div className={styles.trustItem}>
              <Clock3 size={18} />
              <span>Usually takes 3-5 minutes</span>
            </div>
          </div>

          <div className={styles.noteCard}>
            <span>Before you start</span>
            <p>
              Keep your website, LinkedIn, location, NDA, and any pitch or
              financial documents nearby.
            </p>
          </div>
        </aside>

        <main className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.eyebrow}>External submission</span>
              <h2>Founder information request</h2>
              <p>
                Complete the details below so the diligence team can review
                your company accurately.
              </p>
            </div>
            <span className={styles.stepPill}>
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          <div className={styles.progressWrap} aria-label="Form progress">
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className={styles.progressLabels}>
              {stepLabels.map((label, index) => (
                <span
                  key={label}
                  className={step >= index + 1 ? styles.active : ""}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {step === 1 && (
            <section className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIndex}>01</span>
                <div>
                  <h3>Founder contact</h3>
                  <p>
                    Tell us who we should contact if the review team needs
                    clarification.
                  </p>
                </div>
              </div>

              <div className={styles.row}>
                <FieldCard
                  label="First name"
                  icon={<User size={18} />}
                  placeholder="Maria"
                  autoComplete="given-name"
                  value={form.first_name}
                  onChange={(value) => update("first_name", value)}
                  required
                />
                <FieldCard
                  label="Last name"
                  icon={<User size={18} />}
                  placeholder="Santos"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={(value) => update("last_name", value)}
                  required
                />
              </div>

              <FieldCard
                label="Email address"
                icon={<Mail size={18} />}
                type="email"
                placeholder="founder@company.com"
                autoComplete="email"
                value={form.email}
                onChange={(value) => update("email", value)}
                required
              />

              <FieldCard
                label="Phone number"
                icon={<Phone size={18} />}
                type="tel"
                placeholder="+1 555 000 0000"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone_number}
                onChange={(value) => update("phone_number", value)}
              />

              {formError && <p className={styles.formError}>{formError}</p>}

              <Actions next={goNext} />
            </section>
          )}

          {step === 2 && (
            <section className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIndex}>02</span>
                <div>
                  <h3>Company context</h3>
                  <p>
                    Add the business basics, operating location, and supporting
                    files, including the NDA, for review.
                  </p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.column}>
                  <FieldCard
                    label="Company name"
                    icon={<Building2 size={18} />}
                    placeholder="Acme Ventures"
                    autoComplete="organization"
                    value={form.company_name}
                    onChange={(value) => update("company_name", value)}
                  />
                  <FieldCard
                    label="Company website"
                    icon={<Globe size={18} />}
                    type="url"
                    placeholder="https://company.com"
                    autoComplete="url"
                    value={form.company_url}
                    onChange={(value) => update("company_url", value)}
                  />
                  <FieldCard
                    label="Company LinkedIn"
                    icon={<Linkedin size={18} />}
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    value={form.company_linkedin}
                    onChange={(value) => update("company_linkedin", value)}
                  />
                </div>

                <div className={styles.column}>
                  <FieldCard
                    label="City"
                    icon={<MapPin size={18} />}
                    placeholder="San Francisco"
                    autoComplete="address-level2"
                    value={form.location_city}
                    onChange={(value) => update("location_city", value)}
                  />
                  <FieldCard
                    label="State / Region"
                    icon={<MapPin size={18} />}
                    placeholder="California"
                    autoComplete="address-level1"
                    value={form.location_region}
                    onChange={(value) => update("location_region", value)}
                  />
                  <FieldCard
                    label="Country"
                    icon={<MapPin size={18} />}
                    placeholder="United States"
                    autoComplete="country-name"
                    value={form.location_country}
                    onChange={(value) => update("location_country", value)}
                  />
                </div>
              </div>

              <div
                className={styles.dropzone}
                role="button"
                tabIndex={0}
                onClick={() => document.getElementById("fileInput")?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    document.getElementById("fileInput")?.click();
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className={styles.uploadIcon}>
                  <Upload size={24} />
                </div>
                <div>
                  <p>Upload supporting documents</p>
                  <span>NDA, pitch decks, PDFs, spreadsheets, and images</span>
                </div>

                <input
                  id="fileInput"
                  type="file"
                  multiple
                  hidden
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={(e) => handleFiles(e.target.files)}
                />

                {form.files.length > 0 && (
                  <div className={styles.fileList}>
                    {form.files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className={styles.fileItem}
                      >
                        <FileText size={16} />
                        <span>{file.name}</span>
                        <small>{formatFileSize(file.size)}</small>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`${styles.ndaCard} ${
                  ndaAccepted ? styles.ndaAccepted : ""
                }`}
              >
                <div className={styles.ndaIcon}>
                  {ndaAccepted ? (
                    <CheckCircle size={22} />
                  ) : (
                    <ShieldCheck size={22} />
                  )}
                </div>
                <div>
                  <p>{ndaAccepted ? "NDA accepted" : "NDA required"}</p>
                  <span>
                    {ndaAccepted
                      ? "You can review the agreement again before submitting."
                      : "Please read and accept the NDA before submitting this form."}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.ndaButton}
                  onClick={() => setShowNdaModal(true)}
                >
                  {ndaAccepted ? "Review NDA" : "Review and accept NDA"}
                </button>
              </div>

              <div className={styles.actionsWrap}>
                <Actions
                  back={() => setStep(1)}
                  submit={submit}
                  submitting={submitting}
                  submitDisabled={!ndaAccepted}
                />

                {status !== "idle" && (
                  <div className={`${styles.status} ${styles[status]}`}>
                    {status === "loading" && (
                      <Loader className={styles.loader} />
                    )}
                    {status === "success" && <CheckCircle size={16} />}
                    {statusText}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      <NdaModal
        open={showNdaModal}
        onAccept={() => {
          setNdaAccepted(true);
          setShowNdaModal(false);
          setStatus("success");
          setStatusText("NDA accepted. You can now submit the form.");
        }}
        onClose={() => setShowNdaModal(false)}
      />
    </div>
  );
}

function FieldCard({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  required,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
}) {
  return (
    <label className={styles.fieldCard}>
      <span className={styles.fieldHeader}>
        {icon}
        <span>
          {label}
          {required && <em>*</em>}
        </span>
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Actions({
  back,
  next,
  submit,
  submitting,
  submitDisabled,
}: {
  back?: () => void;
  next?: () => void;
  submit?: () => void;
  submitting?: boolean;
  submitDisabled?: boolean;
}) {
  return (
    <div className={styles.actions}>
      {back && (
        <button type="button" className={styles.ghost} onClick={back}>
          <ArrowLeft size={16} />
          Back
        </button>
      )}
      {next && (
        <button type="button" className={styles.primary} onClick={next}>
          Continue
          <ArrowRight size={16} />
        </button>
      )}
      {submit && (
        <button
          type="button"
          onClick={submit}
          disabled={submitting || submitDisabled}
          className={`${styles.primary} ${submitting ? styles.isSubmitting : ""}`}
        >
          {submitting ? (
            <>
              <Loader className={styles.loader} />
              <span className={styles.buttonLabel}>Submitting</span>
            </>
          ) : (
            <>
              Submit profile
              <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
