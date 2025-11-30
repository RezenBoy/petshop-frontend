export function getToken() {
  return localStorage.getItem("token");
}

export function buildHeaders(extra = {}) {
  const token = getToken();
  const headers = { Accept: "application/json", ...extra };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
