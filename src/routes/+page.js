// snippets.js

import { getCookie } from "../utils/cookies";

export async function load({ fetch }) {
  let accessToken = getCookie("access_token");

  const response = await fetch(
    `https://devdox.up.railway.app/api/v1/snippets/snippet/?ordering=-created_at`,
    {
      method: "GET",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    }
  );
  const snippets = await response.json();

  return {
    props: {
      snippets,
    },
  };
}
