import { getCookie } from "./cookies";

export async function fetchUser() {
  let accessToken = getCookie("access_token");
  try {
    const response = await fetch(
      `https://devdox.up.railway.app/api/v1/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      return data;
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Failed to fetch user data", error);
  } finally {
  }
}
export async function fetchSnippets(user_id) {
  let accessToken = getCookie("access_token");

  try {
    const response = await fetch(
      `https://devdox.up.railway.app/api/v1/snippets/snippet/?author=${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const snipcount = await response.json();
      const snippetsCount = snipcount.count;
      return snippetsCount
      
    } else {
      console.error("Failed to fetch snippets");
    }
  } catch (error) {
    console.error("Failed to fetch snippets", error);
  }
}