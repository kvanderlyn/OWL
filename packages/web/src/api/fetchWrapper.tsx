export function fetchWrapper(
      url: string,
      options?: { method?: "GET" | "POST" | "DELETE" | "PUT"; credentials?: "include" | "omit"; body?: string },
) {
      const baseUrl = `${import.meta.env.VITE_AUTH_URL}`;
      return fetch(`${baseUrl}${url}`, {
            method: options?.method || "GET",
            credentials: options?.credentials || "include",
            body: options?.body,
            headers: {
                  "Content-Type": "application/json",
            },
      });
}

export class ApiError extends Error {
      message: string;
      code: number;
      status: string;
      expected: boolean;
      constructor(message: string, statusCode = 500) {
            super(message);
            this.message = message;
            this.code = statusCode;
            this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
            this.expected = true;
      }
}
