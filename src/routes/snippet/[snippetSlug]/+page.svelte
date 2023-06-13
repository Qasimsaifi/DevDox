<script>
  import Navbar from '../../../components/Navbar.svelte';
  import { onMount, afterUpdate } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getCookie } from '../../../utils/cookies';
  let apiKey = import.meta.env.VITE_API_URL;

  let loading = true;
  let data = null;
  const dataSlug = $page.params.snippetSlug;
  onMount(async () => {
    accessToken = getCookie('access_token');

    if (!accessToken) {
      goto('/login');
    } else {
      fetchUser();
    }
  });
  // Fetch data with the specified slug
  const fetchData = async () => {
    try {
      const response = await fetch(`${apiKey}api/v1/snippets/snippet/?slug=${dataSlug}`, {
        headers: {
          Authorization: `Bearer ${getCookie('access_token')}`
        }
      });
      const responseData = await response.json();
      data = responseData.results[0]; // Get the first item from the results array
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchData();
  });

  afterUpdate(() => {
    if (data) {
      initializePrism();
    }
  });

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

  function initializePrism() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js';
    document.head.appendChild(script);
  }
</script>

<Navbar/>

{#if loading}
  <p>Loading...</p>
{:else if data}
  <div class="card">
      <h4>{data.title}</h4>
    <div class="card-content">
      <h4>{data.title}</h4>
      <div>{@html data.content}</div>
      <div class="code-snippet">
        <button class="copy-button" on:click={(event) => copySnippet(data.code_snippet, event)}>
          <i class="fas fa-copy"></i>
        </button>
        {@html data.code_snippet}
      </div>
    </div>
  </div>
{:else}
  <p>Not found</p>
{/if}




<style>
  /* Loading message */
  p {
    font-size: 20px;
    text-align: center;
    margin-top: 50px;
  }

  /* Card */
  .card {
    padding: 20px;
    margin-bottom: 20px;
    width: 80vw;
    margin-left: auto;
    margin-right: auto;
  }

  /* Card title */
  .card h4 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  /* Card content */
  .card-content {
    margin-top: 20px;
  }

  /* Copy button */
  .copy-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: auto;
    margin-right: 0;
  }

  .copy-button i {
    margin-right: 5px;
  }

  /* Code snippet */
  .code-snippet {
    background-color: #272b33;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .card {
      width: 100vw;
    }

    .copy-button {
      margin-left: auto;
    }
  }

  /* Other styles */
  /* ... */
</style>
