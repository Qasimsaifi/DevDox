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
      const response = await fetch('https://blogaxis-api.up.railway.app/api/v1/user', {
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
      const response = await fetch(`https://blogaxis-api.up.railway.app/api/v1/snippets/snippet/?author=${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const snipdata = await response.json();
        snippets = snipdata.results;
        console.log(snippets);
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

<main>
  {#if isLoading}
    <div class="loader"><p>Loading...</p></div>
  {:else if user}
    <div class="profile">
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
              {@html snippet.code_snippet}
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

<!-- Styling for the main content section -->
<style>
  main {
    padding: 20px;
  }

  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
  }

  .card {
    background-color: #333;
    padding: 20px;
    border-radius: 5px;
    color: #fff;
    width: 100%;
    height: 100%;
  }

  .card-content {
    border-radius: 5px;
    margin-top: 10px;
    overflow: hidden;
    max-height: 250px;
  }

  h4 {
    margin-bottom: 5px;
  }

  .copy-button {
    background-color: #333;
    border: none;
    color: #fff;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-button:hover {
    background-color: #555;
  }

  .copy-button i {
    margin-right: 5px;
  }

  .loader p {
    font-size: 24px;
  }

  /* Responsive styles */
  @media (min-width: 768px) {
    .card {
      max-width: 400px;
      margin: 0 auto;
    }
  }

  @media (min-width: 1024px) {
    .card-container {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
  }
  .snippet-heading {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
    text-transform: uppercase;
  }
</style>
