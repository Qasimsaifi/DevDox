<!-- UploadSnippet.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getCookie } from '../utils/cookies';
  import { goto } from '$app/navigation';
  let user = {};
  let isLoading = true;

  let accessToken;
  let title = '';
  let slug = '';
  let content = '';
  let codeSnippet = '';
  let image = null;
  let createdAt = new Date().toISOString(); // Set default value to current date
  let updatedAt = new Date().toISOString(); // Set default value to current date
  let isPrivate = false;
  let author = null;

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
      const response = await fetch(`https://devdox.up.railway.app/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        user = data;
        author = user.id;
        console.log(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      isLoading = false;
    }
  }

  async function uploadSnippet() {
    isLoading = true;
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', content);
      formData.append('code_snippet', codeSnippet);
      formData.append('image', image);
      formData.append('created_at', createdAt);
      formData.append('updated_at', updatedAt);
      formData.append('is_private', isPrivate ? 1 : 0);
      formData.append('author', author);

      const response = await fetch('https://devdox.up.railway.app/api/v1/snippets/snippet/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      });

      if (response.ok) {
        console.log('Snippet uploaded successfully');
        isLoading = false;
        // Reset the form fields
        title = '';
        slug = '';
        content = '';
        codeSnippet = '';
        image = null;
        createdAt = new Date().toISOString();
        updatedAt = new Date().toISOString();
        isPrivate = false;
      } else {
        console.error('Failed to upload snippet');
      }
    } catch (error) {
      console.error('Failed to upload snippet', error);
    }
  }
</script>

<main>
  {#if isLoading}
    <div class="loader"></div>
  {:else if user}
    <div class="profile">
      <h1 class="upload-heading">Upload Snippet</h1>
    </div>

    <form on:submit|preventDefault={uploadSnippet}>
      <label for="title">Title:</label>
      <input type="text" id="title" bind:value={title} required>

      <label for="slug">Slug:</label>
      <input type="text" id="slug" bind:value={slug} required>

      <label for="content">Content:</label>
      <textarea id="content" bind:value={content} required></textarea>

      <label for="codeSnippet">Code Snippet:</label>
      <textarea id="codeSnippet" bind:value={codeSnippet} required></textarea>

      <!-- <label for="image">Image:</label>
      <input type="file" id="image" bind:files={image} accept="image/*"> -->

      <label for="createdAt">Created At:</label>
      <input type="text" id="createdAt" value={createdAt} readonly>

      <label for="updatedAt">Updated At:</label>
      <input type="text" id="updatedAt" value={updatedAt} readonly>

      <label for="isPrivate">Is Private:</label>
      <select id="isPrivate" bind:value={isPrivate}>
        <option value="false">Public</option>
        <option value="true">Private</option>
      </select>

      <label for="author">Author:</label>
      <input type="text" id="author" value={user.name.full_name} readonly>

      <button type="submit">Upload</button>
    </form>
  {:else}
    <p class="error">Failed to fetch user data.</p>
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

  .profile {
    text-align: center;
  }

  .upload-heading {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  form {
    display: grid;
    grid-gap: 10px;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    font-weight: bold;
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button[type='submit'] {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button[type='submit']:hover {
    background-color: #555;
  }

  p.error {
    text-align: center;
    margin-top: 20px;
    color: #f00;
  }
</style>
