<!-- MySnippets.svelte -->
<script>
  import { onMount } from "svelte";
  import { getCookie } from "../utils/cookies";
  import { goto } from "$app/navigation";
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  let user = {};
  let snippets = [];
  let userName = {};
  let isLoading = true;
  let page = 1;

  let accessToken;

  onMount(async () => {
    accessToken = getCookie("access_token");

    if (!accessToken) {
      goto("/login");
    } else {
      fetchUser();
    }
  });

  async function fetchUser() {
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/user/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        user = data;
        userName = data.name;
        fetchSnippets();
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
      isLoading = false;
    }
  }

  async function fetchSnippets() {
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/snippet/?ordering=-created_at&author=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const snipdata = await response.json();
        snippets = snipdata;
      } else {
        console.error("Failed to fetch snippets");
      }
    } catch (error) {
      console.error("Failed to fetch snippets", error);
    }
  }
</script>

<div class="card-div">
  {#if isLoading}
    <div class="loader" />
  {:else if user}
    <div class="snippet-cont">
      <h1 class="snippet-heading">
        Your Snippet Collection {userName.full_name}
      </h1>
    </div>

    {#if snippets.length > 0}
      <div class="card-container">
        {#each snippets as snippet (snippet.id)}
          <a href={"/snippet/" + snippet.slug}>
            <div class="card">
              <h4>{snippet.title}</h4>
              <div class="card-content editor-container">
                  <CodeMirror
                    bind:value={snippet.code_snippet}
                    lang={snippet.language === "javascript"
                      ? javascript()
                      : python()}
                    styles={{
                      "&": {
                        width: "400px",
                        height: "400px",
                      },
                    }}
                    theme={oneDark}
                    readonly
                  />
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="loader" />
    {/if}
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</div>
