const API_BASE = import.meta.env.VITE_API_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;

  const data = JSON.parse(text);

  // 🔑 API Gateway Lambda proxy response
  if (typeof data.body === "string") {
    return JSON.parse(data.body);
  }

  return data;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Request failed");
  }

  return handleResponse<T>(res);
}
