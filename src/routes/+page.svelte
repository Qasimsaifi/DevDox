<script>
  // Importing the necessary components and functions
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from "svelte";
  import { getCookie } from "../utils/cookies";
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  let snippets;
  let isLoading = true;
  let value;
  onMount(async () => {
    // Check if access token is available
    const accessToken = getCookie("access_token");

    try {
      // Set loading state to true
      isLoading = true;

      // Make the GET request to the API endpoint
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/snippet/`,
        {
          method: "GET",
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      if (response.ok) {
        const data = await response.json();
        snippets = data;
        value = snippets.code_snippet;
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<!-- Rendering the Navbar component -->
<Navbar />

<!-- Main content section -->
<div class="card-div">
  {#if isLoading}
    <!-- Show loader while fetching data -->
    <div class="loader" />
  {:else if snippets.length > 0}
    <!-- Displaying a list of snippets using CSS Grid -->
    <div class="card-container">
      {#each snippets as snippet (snippet.id)}
        <a href={"/snippet/" + snippet.slug}>
          <div class="card">
            <h4>{snippet.title}</h4>
            <div class="card-content editor-container">
              {#if snippet.language == "javascript"}
                <CodeMirror
                  bind:value={snippet.code_snippet}
                  lang={snippet.language === "javascript"
                    ? javascript()
                    : python()}
                  styles={{
                    "&": {
                      width: "400px",
                      height: "80vh",
                    },
                  }}
                  theme={oneDark}
                  readonly
                />
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <!-- If no snippets are found, display a message -->
    <p>No snippets found.</p>
  {/if}
</div>
