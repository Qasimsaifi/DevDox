import { getCookie } from "./cookies";

export async function postAuthData(url, data, type) {
  let accessToken = getCookie("access_token");
  try {
    const response = await fetch(url, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: data
    });

    if (response.ok) {
      console.log('Snippet uploaded successfully');
      const responseData = await response
      return responseData;
    } else {
      console.error('Failed to upload snippet');
    }
  } catch (error) {
    console.error('Failed to upload snippet', error);
  }
}
