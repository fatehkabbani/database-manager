type fetchApiProps = {
  url: string;
  method: string;
  body?: unknown;
  credentials?: "include" | "same-origin";
  headers?: HeadersInit;
};

const BASE_URL = "http://localhost:3000";

/**
 * Generic fetch API function.
 * @param {string} url - The endpoint URL.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {unknown} [body] - The request payload (optional).
 * @param {"include" | "same-origin"} [credentials="include"] - Whether to include cookies for cross-origin requests.
 * @param {HeadersInit} [headers={}] - Custom headers (optional).
 * @returns {Promise<any | null>} - The response data or `null` if an error occurs.
 */
export const fetchApi = async ({
  url,
  method,
  body,
  credentials = "include",
  headers = {},
}: fetchApiProps) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body ? JSON.stringify(body) : undefined,
      credentials,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch API error:", error);
    return null;
  }
};
