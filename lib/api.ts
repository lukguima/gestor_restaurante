const API_URL = "/api"

export const api = {
  get: async (endpoint: string, init?: RequestInit) => {
    const res = await fetch(`${API_URL}${endpoint}`, init)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  post: async (endpoint: string, data: unknown, init?: RequestInit) => {
    const headers = {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  put: async (endpoint: string, data: unknown, init?: RequestInit) => {
    const headers = {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  delete: async (endpoint: string, init?: RequestInit) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...init,
      method: "DELETE",
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}
