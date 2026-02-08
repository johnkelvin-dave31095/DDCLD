import { post } from "./http";

/* ======================================================
 * FILE UPLOAD TYPES
 * ====================================================== */

export type FounderFile = {
  filename: string;
  s3_key: string;
  size?: number;
  content_type?: string;
};

/* ======================================================
 * SUBMIT FOUNDER
 * ====================================================== */

export type SubmitFounderRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;

  company_name: string;
  company_url?: string;
  company_linkedin?: string;
  company_sharepoint?: string;

  location_city?: string;
  location_region?: string;
  location_country?: string;

  files?: FounderFile[];
};

export type SubmitFounderResponse = {
  success: boolean;
  founder_id: number;
  files_count?: number;
};

export function submitFounder(data: SubmitFounderRequest) {
  return post<SubmitFounderResponse>("/founders/submit", data);
}

/* ======================================================
 * DASHBOARD
 * ====================================================== */

export type SectionCompletion = {
  answered: number;
  total: number;
};

export type FounderDashboardRow = {
  founder_id: number;
  company_name: string;
  file_count: number;
  answered_items: number;
  total_items: number;
  completion_pct: number;

  section_breakdown: {
    management: SectionCompletion;
    industry: SectionCompletion;
    marketability: SectionCompletion;
    business: SectionCompletion;
    financial: SectionCompletion; // 👈 ADD THIS
  };

  extraction_complete: boolean;
  has_file_summaries: boolean;
  has_conflicts: boolean;
  last_updated: string | null;

  status: "almost_complete" | "needs_more_data" | "incomplete";

  processing_status:
    | "no_files"
    | "extracting_text"
    | "summarizing_files"
    | "done";
};

export type FoundersDashboardResponse = {
  founders: FounderDashboardRow[];
};

export function getFoundersDashboard() {
  return post<FoundersDashboardResponse>("/founders", {});
}

/* ======================================================
 * RUN ASSESSMENT
 * ====================================================== */

export type RunFounderAssessmentResponse = {
  founder_id: number;
  files_dispatched: number;
};

export function runFounderAssessment(founder_id: number) {
  return post<RunFounderAssessmentResponse>("/founders/assessment", {
    founder_id,
  });
}

/* ======================================================
 * VIEW FILE SCORES (UPDATED)
 * ====================================================== */

/**
 * One scored criterion WITH answer
 */
export type CriterionScore = {
  key: string;
  name: string;
  score_key: "weak" | "neutral" | "strong";
  score_value: number;
  rule_description: string;

  /** NEW */
  answer: string | null;
  sources?: string[];
};

/**
 * Scores for one assessment area
 */
export type AreaScore = {
  key: string;
  name: string;
  score_summary: {
    average: number | null;
    min: number | null;
    max: number | null;
  };
  criteria: CriterionScore[];
};

/**
 * Score view for a single founder
 */
// export type FounderScore = {
//   founder_id: number;
//   areas: AreaScore[];
// };

/**
 * Response when fetching all founders' scores
 */
export type ViewAllFounderScoresResponse = {
  founders: FounderScore[];
};

export function getFounderScore(founder_id: number) {
  return post<FounderScore>("/founders/viewscore", {
    founder_id,
  });
}

export type FinancialSummary = {
  deal_type_id: string | null;
  total_score: number | null;
  max_score: number | null;
  score_pct: number | null;
};

export type FinancialDetails = {
  financial_inputs?: Record<string, number | null>;
  pro_forma_inputs?: Record<string, number | null>;
  pro_forma_outputs?: Record<string, number | null>;
  revenue_and_margin?: Record<string, number | null>;
  assessment?: Record<string, number | null>;
  sources?: any;
};

export type FounderScore = {
  founder_id: number;
  areas: any[];
  financials?: {
    summary?: FinancialSummary | null;
    details?: FinancialDetails | null;
  } | null;
};

export function getAllFounderScores() {
  return post<ViewAllFounderScoresResponse>("/founders/viewscore", {});
}

/* ======================================================
 * MISSING INFO (GROUPED BY ASSESSMENT AREAS)
 * ====================================================== */

export type MissingCriterion = {
  criteria_id: string;
  key: string;
  name: string;
  description?: string;
  data_type: string;
  order_index?: number;
};

export type MissingAssessmentArea = {
  area_id: string;
  area_key: string;
  area_name: string;
  description?: string;
  order_index?: number;
  criteria: MissingCriterion[];
};

export type MissingFinancialField = {
  section: string;
  key: string;
  label: string;
  type: string;
};

export type GetMissingInfoResponse = {
  founder_id: number;
  assessment_areas: MissingAssessmentArea[];
  financial: MissingFinancialField[];
  requires_files: boolean;
};

export function getFounderMissingInfo(founder_id: number) {
  return post<GetMissingInfoResponse>("/founders/missinginfo", {
    founder_id,
  });
}

/* ======================================================
 * UPDATE MISSING INFO
 * ====================================================== */

export type UpdateMissingInfoRequest = {
  founder_id: number;
  area_key: string;
  criterion_key: string;
  value:
    | number
    | {
        summary: string;
        sources?: string[];
      };
};

export type UpdateMissingInfoResponse = {
  success: boolean;
};

export function updateFounderMissingInfo(data: UpdateMissingInfoRequest) {
  return post<UpdateMissingInfoResponse>("/founders/updatemissing", data);
}

/* ================= FINANCIAL REFERENCES ================= */

export type FinancialMetric = {
  file_id: number;
  filename: string | null; // 👈 ADD THIS
  metric_id: number;
  metric_key: string;
  value_numeric: number | null;
  value_text: string | null;
  unit: string | null;
  value_type: string | null;
  period_year: number | null;
  period_label: string | null;
  confidence: number | null;
  excerpt: string | null;
  created_at: string;
};

export type GetFinancialRefResponse = {
  success: boolean;
  founder_id: number;
  metrics: FinancialMetric[];
};

export function getFounderFinancialRef(data: { founder_id: number }) {
  return post<GetFinancialRefResponse>("/founders/financialref", {
    founder_id: data.founder_id,
  });
}
