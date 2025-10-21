const API_BASE_URL =
  process.env.REACT_APP_REVIEWS_API_BASE?.replace(/\/$/, "") ??
  "https://68db330423ebc87faa323a9f.mockapi.io/review";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function safeFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `요청 실패: ${response.status}`);
  }

  return response.json();
}

export async function fetchReviews(mntnId) {
  const url = mntnId ? `${API_BASE_URL}?mntnId=${encodeURIComponent(mntnId)}` : API_BASE_URL;
  return safeFetch(url);
}

export async function createReview(payload) {
  return safeFetch(`${API_BASE_URL}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReview(id, payload) {
  return safeFetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteReview(id) {
  return safeFetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
