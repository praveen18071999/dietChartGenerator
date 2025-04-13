import { useRouter } from "next/navigation";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const router = useRouter(); // Ensure router is available for redirection
  let accessToken = localStorage.getItem("accessToken");

  // If no access token, try refreshing it
  if (!accessToken) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      router.push("/login"); // Redirect to login if refresh fails
      return;
    }
  }

  // Make the authenticated request
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If the access token is expired, try refreshing it
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (!accessToken) {
      router.push("/login"); // Redirect to login if refresh fails
      return;
    }

    // Retry the request with the new access token
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return response;
}

export async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
  
    try {
      const response = await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      }
  
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken); // Save the new access token
      return data.accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  }