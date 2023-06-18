<!-- MySnippets.svelte -->
<script>
  // Importing the necessary components and functions
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from 'svelte';
  import { getCookie } from '../utils/cookies';
  let snippets = [];
  let isLoading = true; 
  onMount(async () => {
    // Check if access token is available
    const accessToken = getCookie('access_token');
    
    try {
      // Set loading state to true
      isLoading = true;
      
      // Make the GET request to the API endpoint
      const response = await fetch(`https://devdox.up.railway.app/api/v1/snippets/snippet/`, {
        method: "GET",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        snippets = data.results;
        initializePrism();
      } else {
        console.error("Error:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading = false;
    }
  });

  function initializePrism() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js';
    document.head.appendChild(script);
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

<!-- Rendering the Navbar component -->
<Navbar/>

<!-- Main content section -->
<main>
  {#if isLoading}
    <!-- Show loader while fetching data -->
    <div class="loader"></div>
  {:else if snippets.length > 0}
    <!-- Displaying a list of snippets using CSS Grid -->
    <div class="card-container">
      {#each snippets as snippet (snippet.id)}
        <div class="card">
          <a href={"/snippet/"+snippet.slug}>
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
    <!-- If no snippets are found, display a message -->
    <p>No snippets found.</p>
  {/if}
</main>

