<!-- UploadSnippet.svelte -->
<script>
  import { onMount } from "svelte";
  import { getCookie } from "../utils/cookies";
  import { goto } from "$app/navigation";
  import { postAuthData } from "../utils/authReq";
  import { fetchUser } from "../utils/fetchData";
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  import Editor from '@tinymce/tinymce-svelte'
  let user = {};
  let isLoading = true;
  let code;

  let apiKey = "57uq22dj8wgzh3n9989668cmek929nyrzj4dq0rs40funcv6";
  let conf = {
    height: 500,
    plugins: [
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
      "codesample",
    ],
    toolbar:
      "undo redo |casechange blocks codesample| bold italic backcolor | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent codesample| removeformat | code table ",
  };

  let accessToken;
  let title = "";
  let slug = "";
  let content = "";
  let language = "javascript";
  let files = []; // Set default value to current date
  let isPrivate = 1;
  let author = null;
  let value = `
    // This is the starter code
    function helloWorld() {
      console.log("Hello, World!");
    }
    
    helloWorld();
  `;
  let editorLanguage = javascript();
  let buttonValue = "Python";

  function changeEditorLanguage() {
    if (buttonValue == "Python") {
      buttonValue = "Javascript";
      editorLanguage = python();
      value = `print("Hello world");
  `;
      console.log("language is py  now");
    } else {
      buttonValue = "Python";
      editorLanguage = javascript();
      console.log("language is js now");
    }
  }

  onMount(async () => {
    accessToken = getCookie("access_token");
    code = "// Start coding here...";

    if (!accessToken) {
      goto("/login");
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
      console.error("Failed to fetch user data.", error);
    }
  }

  async function uploadSnippet() {
    isLoading = true;
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", content);
      formData.append("code_snippet", value);
      formData.append("language", language);
      formData.append("image", files[0]);
      formData.append("is_private", isPrivate);
      formData.append("author", author);

      const jsonData = {};
      for (let [key, value] of formData.entries()) {
        jsonData[key] = value;
      }
      const data = JSON.stringify(jsonData);

      await postAuthData(
        "https://devdox.up.railway.app/api/v1/snippets/snippet/",
        data,
        "POST"
      );
      console.log(data);
      isLoading = false;
    } catch (error) {
      console.error("Failed to upload snippet", error);
    }
  }
</script>

<div class="editor">
  <!-- <button on:click={checkEditorvalue}>hiii</button> -->
  {#if isLoading}
    <div class="loader" />
  {:else if user}
    <div class="snippet-cont upload-heading">
      <h1 class="snippet-heading">Upload Snippet</h1>
    </div>

    <form on:submit|preventDefault={uploadSnippet}>
      <label for="title">Title:</label>
      <input type="text" id="title" bind:value={title} required />

      <label for="slug">Slug:</label>
      <input type="text" id="slug" bind:value={slug} required />

      <label for="content">Content:</label>
      <!-- <textarea id="content" bind:value={content} required /> -->
      <Editor id="statement" {apiKey} {conf} bind:value={content} />

      <label for="codeSnippet">Code Snippet:</label>
      <div class="editor-container">
        <button on:click={changeEditorLanguage}>{buttonValue}</button>

        <CodeMirror
  bind:value
  lang={editorLanguage}
  styles={{
    "&": {
      width: "100%",
      height: "80vh",
    },
  }}
  theme={oneDark}
/>
      </div>
      <label for="image">Image:</label>
      <input type="file" id="image" bind:files />
      <label for="isPrivate">Is Private:</label>
      <select id="isPrivate" bind:value={isPrivate}>
        <option value=0>Public</option>
        <option value=1>Private</option>
      </select>
      <label for="language">Snippet Language:</label>
      <select id="language" bind:value={language}>
        <option value="python">Python</option>
        <option value="javascript">Javascript</option>
      </select>

      <label for="author">Author:</label>
      <input type="text" id="author" value={user.name.full_name} readonly />

      <button type="submit">Upload</button>
    </form>
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</div>

<!-- Styling for the main content section -->
<style>
  
  .editor {
    margin-top: 100px;
  }
  .editor-container{
    font-size: 16px;
  }
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
  }


  .loader::after {
    content: "";
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
    max-width: 90vw;
    margin: 0 auto;
  }

  label {
    font-weight: bold;
  }

  input,
  select {
    width: 100%;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button[type="submit"] {
    background-color: #333;
    color: #fff;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button[type="submit"]:hover {
    background-color: #555;
  }

  p.error {
    text-align: center;
    margin-top: 20px;
    color: #f00;
  }
</style>
