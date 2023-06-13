<!-- MySnippets.svelte -->
<script>
  // Importing the necessary components and functions
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from 'svelte';
  import { getCookie } from '../utils/cookies';
  
  // Initializing an empty array to store the snippets
  let snippets = [];
  let isLoading = true; // Flag to track loading state

  // Using the onMount lifecycle function to execute code when the component is mounted
  onMount(async () => {
    // Check if access token is available
    const accessToken = getCookie('access_token');
    
    try {
      // Set loading state to true
      isLoading = true;
      
      // Make the GET request to the API endpoint
      const response = await fetch("https://blogaxis-api.up.railway.app/api/v1/snippets/snippet/", {
        method: "GET",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });

      if (response.ok) {
        // If the response is successful, parse the JSON data and store it in the snippets array
        const data = await response.json();
        snippets = data.results;
        // Call the function to initialize Prism.js after the snippets are loaded
        initializePrism();
      } else {
        // If the response is not successful, log the error
        console.error("Error:", response.status);
      }
    } catch (error) {
      // If an error occurs during the request, log the error
      console.error("Error:", error);
    } finally {
      // Set loading state to false
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

<!-- Styling for the main content section -->
<style>
  main {
    padding: 20px;
  }
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
  }

  .loader::after {
    content: '';
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #ccc;
    border-top-color: #888;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
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
</style>
