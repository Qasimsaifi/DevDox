<script>
  // Importing the necessary components and functions
  import Navbar from "../components/Navbar.svelte";
  import { onMount } from 'svelte';

  // Initializing an empty array to store the snippets
  let snippets = [];
  let isLoading = true; // Flag to track loading state

  // Using the onMount lifecycle function to execute code when the component is mounted
  onMount(async () => {
    // Setting the request headers including the authorization token
    let headersList = {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxOTA5MzIzLCJpYXQiOjE2ODY1NTI1MjMsImp0aSI6IjlhNzYxYTFkNTFiMzQ3ZTI4YTMyNzk4YzEwM2Q3ZjdkIiwidXNlcl9pZCI6MX0.1quWVsuBtjX8rJfbfXp5GB5PUbS49894l3Q7dyExr8g",
      "Content-Type": "application/json"
    };

    try {
      // Set loading state to true
      isLoading = true;

      // Making the GET request to the API endpoint
      let response = await fetch("https://blogaxis-api.up.railway.app/api/v1/snippets/snippet/", {
        method: "GET",
        headers: headersList
      });

      if (response.ok) {
        // If the response is successful, parse the JSON data and store it in the snippets array
        let data = await response.json();
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
    let script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
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
    <div class="loader"><p>Loding...</p></div>
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

  .loader p{
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
</style>
