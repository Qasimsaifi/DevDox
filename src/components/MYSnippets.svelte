<!-- MySnippets.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getCookie } from '../utils/cookies';
  import { goto } from '$app/navigation';
  let user = {};
  let snippets = [];
  let userName = {};
  let isLoading = true;

  let accessToken;

  onMount(async () => {
    accessToken = getCookie('access_token');

    if (!accessToken) {
      goto('/login');
    } else {
      fetchUser();
    }
  });

  async function fetchUser() {
    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/user/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        user = data;
        userName = data.name;
        fetchSnippets();
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      isLoading = false;
    }
  }

  async function fetchSnippets() {
    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/snippets/snippet/?author=${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const snipdata = await response.json();
        snippets = snipdata.results;
      } else {
        console.error('Failed to fetch snippets');
      }
    } catch (error) {
      console.error('Failed to fetch snippets', error);
    }
  }
  function copySnippet(code, event) {
    // Extract the code snippet without <pre> and <code> tags
    const extractedCode = code.replace(/<\/?(?:pre|code)[^>]*>/g, '');

    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = extractedCode;

    // Append the textarea to the body
    document.body.appendChild(textarea);

    // Select the textarea and copy its contents
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea from the body
    document.body.removeChild(textarea);

    // Update all the copy buttons' icons
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
      const icon = button.querySelector('i');
      icon.classList.remove('fa-check');
      icon.classList.add('fa-copy');
    });

    // Toggle the icon classes to show the "Copied" icon for the clicked button
    const button = event.target;
    const icon = button.querySelector('i');
    icon.classList.remove('fa-copy');
    icon.classList.add('fa-check');

    // Reset the icon after a certain time (e.g., 2 seconds)
    setTimeout(() => {
      icon.classList.remove('fa-check');
      icon.classList.add('fa-copy');
    }, 2000);
  }
</script>

<main class="mysnip-cont">
  {#if isLoading}
    <div class="loader"></div>
  {:else if user}
    <div class="snippet-cont">
      <h1 class="snippet-heading">Your Snippet Collection {userName.full_name}</h1>
    </div>

    {#if snippets.length > 0}
      <div class="card-container">
        {#each snippets as snippet (snippet.id)}
          <div class="card">
            <a href={"/snippet/" + snippet.slug}>
              <h4>{snippet.title}</h4>
            </a>
            <div class="card-content">
              <button class="copy-button" on:click={(event) => copySnippet(snippet.code_snippet, event)}>
                <i class="fas fa-copy"></i>
              </button>
              <pre class={`language-${snippet.language}`}>
                <code>
  
                  {@html snippet.code_snippet}
                </code>
              </pre>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p>No snippets found.</p>
    {/if}
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</main>

