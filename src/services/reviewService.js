const API_BASE_URL =
  process.env.REACT_APP_REVIEWS_API_BASE?.replace(/\/$/, "") ??
  "https://mockapi.io/placeholder/reviews";

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

export async function fetchReviews() {
  return safeFetch(`${API_BASE_URL}`);
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
