export async function api(path, { token, method = "GET", body, form } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (form) {
    payload = form
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json"
    payload = JSON.stringify(body)
  }

  const response = await fetch(path, { method, headers, body: payload })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || "Request failed")
    error.status = response.status
    throw error
  }
  return data
}

export function readProducts(payload) {
  if (Array.isArray(payload)) {
    return { products: payload, pagination: null }
  }
  return {
    products: Array.isArray(payload.data) ? payload.data : [],
    pagination: payload.pagination || null,
    searchQuery: payload.searchQuery || "",
  }
}
