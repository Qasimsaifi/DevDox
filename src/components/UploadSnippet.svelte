<!-- UploadSnippet.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getCookie } from '../utils/cookies';
  import { goto } from '$app/navigation';
  import { postAuthData } from '../utils/authReq';
  import { fetchUser } from '../utils/fetchData';

  let user = {};
  let isLoading = true;

  let accessToken;
  let title = '';
  let slug = '';
  let content = '';
  let codeSnippet = '';
  let language = 'javascript';
  let files = [];
  let createdAt = new Date().toISOString(); // Set default value to current date
  let updatedAt = new Date().toISOString(); // Set default value to current date
  let isPrivate = false;
  let author = null;

  onMount(async () => {
    accessToken = getCookie('access_token');

    if (!accessToken) {
      goto('/login');
    } else {
      await getUser();
    }
  });

  async function getUser() {
    try {
      user = await fetchUser();
      author = user.id;
      isLoading = false;
    } catch (error) {
      console.error('Failed to fetch user data.', error);
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
      formData.append('language', language);
      formData.append('image', files[0]);
      formData.append('created_at', createdAt);
      formData.append('updated_at', updatedAt);
      formData.append('is_private', isPrivate ? 1 : 0);
      formData.append('author', author);

      const jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value;
      }
      const data = JSON.stringify(jsonData);

      await postAuthData('https://devdox.up.railway.app/api/v1/snippets/snippet/', data, 'POST');
      // console.log(formData);
      isLoading = false;
    } catch (error) {
      console.error('Failed to upload snippet', error);
    }
  }
</script>

<main>
  {#if isLoading}
    <div class="loader"></div>
  {:else if user}
    <div class="snippet-cont upload-heading">
      <h1 class="snippet-heading">Upload Snippet</h1>
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

      <label for="image">Image:</label>
      <input type="file" id="image" bind:files >

      <label for="createdAt">Created At:</label>
      <input type="text" id="createdAt" value={createdAt} readonly>

      <label for="updatedAt">Updated At:</label>
      <input type="text" id="updatedAt" value={updatedAt} readonly>

      <label for="isPrivate">Is Private:</label>
      <select id="isPrivate" bind:value={isPrivate}>
        <option value="false">Public</option>
        <option value="true">Private</option>
      </select>
      <label for="language">Is Private:</label>
      <select id="language" bind:value={language}>
        <option value="python">Python</option>
        <option value="javascript">Javascript</option>
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



  .upload-heading {
    margin-top: 70px;
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
