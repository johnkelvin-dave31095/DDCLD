import { post } from "./http";

export type Metrics = Record<string, number | null>;

export type Computed = {
  historical: Record<string, number | null>;
  proforma: Record<string, number | null>;
};

export type AnalysisResponse = {
  status: string;
  metrics: Metrics;
  computed: Computed;
  llama_raw?: string; // 👈 ADD THIS
  llama_error?: string; // 👈 optional (from backend)
};

export type FileItem = {
  file_id: number;
  founder_id: number;
  filename: string;
  company_name: string;
};

type ListFilesResponse = {
  status: string;
  files: FileItem[];
};

type PromptResponse = {
  status: string;
  prompt: string;
};

function unwrap(res: any) {
  if (res?.body) {
    try {
      return JSON.parse(res.body);
    } catch {
      return res;
    }
  }
  return res;
}

export const listFiles = async (): Promise<FileItem[]> => {
  const raw = await post("/AnalyzeExcel", {
    action: "list_files",
  });

  const res = unwrap(raw) as ListFilesResponse;

  console.log("LIST FILE RESPONSE:", res);

  return res?.files ?? [];
};

export const analyzeFile = async (
  founder_id: number,
  file_id: number,
): Promise<AnalysisResponse> => {
  const raw = await post("/AnalyzeExcel", {
    action: "process_file",
    founder_id,
    file_id,
  });

  const res = unwrap(raw) as AnalysisResponse;

  return res;
};

export const getPrompt = async (): Promise<{ prompt: string }> => {
  const raw = await post("/AnalyzeExcel", {
    action: "get_prompt",
  });

  const res = unwrap(raw) as PromptResponse;

  return {
    prompt: res?.prompt ?? "",
  };
};

export const updatePrompt = async (prompt: string): Promise<void> => {
  await post("/AnalyzeExcel", {
    action: "update_prompt",
    prompt,
  });
};
