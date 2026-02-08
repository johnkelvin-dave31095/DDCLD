import axios from "axios";

export type PresignRequest = {
  method: "PUT" | "GET";
  key: string;
  content_type?: string;
  expires_in?: number;
  download_name?: string;
};

export type PresignResponse = {
  url: string;
  bucket: string;
  key: string;
};

const presignClient = axios.create({
  baseURL: "https://bs0lamxw7h.execute-api.us-east-1.amazonaws.com/dev",
  headers: { "Content-Type": "application/json" },
});

export async function presign(data: PresignRequest): Promise<PresignResponse> {
  const res = await presignClient.post<PresignResponse>("/presign", data);
  return res.data;
}
