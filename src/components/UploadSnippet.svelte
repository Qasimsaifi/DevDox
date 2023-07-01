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
  import Editor from "@tinymce/tinymce-svelte";
  let user;
  let isUserLoded = false
  let isLoading = false;
  let code;
  let userInfo;

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
  let files = [];
  let isPrivate = 1;
  let author = null;
  let value = `
    // This is the starter code
    function helloWorld() {
      console.log("Hello, World!");
    }
    
    helloWorld();
  `;
  let fieldsEmpty;
  let editorLanguage = javascript();
  let buttonValue = "Javascript";

  function changeEditorLanguage() {
    if (buttonValue == "Javascript") {
      buttonValue = "Python";
      editorLanguage = python();
      value = `print("Hello world");
  `;
    } else {
      buttonValue = "Javascript";
      editorLanguage = javascript();
      value = `
    // This is the starter code
    function helloWorld() {
      console.log("Hello, World!");
    }
    
    helloWorld();
  `;
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
      userInfo = user.name
      isUserLoded = true;
    } catch (error) {
      console.error("Failed to fetch user data.", error);
    }
  }

  async function uploadSnippet() {
    isLoading = true;

    // Validation check for required fields

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

      const response = await fetch(
        "https://devdox.up.railway.app/api/v1/snippets/snippet/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        isLoading = false;
        title = "";
        slug = "";
        content = "";
        language = "javascript";
        files = [];
        isPrivate = 1;
        author = null;
        value = `
    // This is the starter code
    function helloWorld() {
      console.log("Hello, World!");
    }
    
    helloWorld();
  `;
      } else {
        throw new Error("Failed to upload snippet");
      }
    } catch (error) {
      console.error("Failed to upload snippet", error);
    }
  }
</script>
{#if user}
  
<div class="editor">
  <!-- <button on:click={checkEditorvalue}>hiii</button> -->
  
    <div class="snippet-cont upload-heading">
      <h1 class="snippet-heading">Upload Snippet</h1>
    </div>

    <form
      on:submit|preventDefault={uploadSnippet}
      enctype="multipart/form-data"
    >
      <label for="title">Title:</label>
      <input type="text" id="title" bind:value={title} required />

      <label for="slug">Slug:</label>
      <input type="text" id="slug" bind:value={slug} required />

      <label for="content">Content:</label>
      <!-- <textarea id="content" bind:value={content} required /> -->
      <Editor id="statement" {apiKey} {conf} bind:value={content} required />

      <label for="codeSnippet">Code Snippet:</label>
      <div class="editor-container">
        <button on:click|preventDefault={changeEditorLanguage}
          >Editor Language is {buttonValue} click to change</button
        >

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
          requried
        />
      </div>
      <label for="image">Image:</label>
      <input type="file" id="image" bind:files />
      <label for="isPrivate">Is Private:</label>
      <label for="author">Author:</label>
      <input type="text" id="author" value={userInfo.full_name} required readonly/>
      <select id="isPrivate" bind:value={isPrivate} required>

        <option value="0">Public</option>
        <option value="1">Private</option>
      </select>
      <label for="language">Snippet Language:</label>
      <select id="language" bind:value={language} required>
        <option value="python">Python</option>
        <option value="javascript">Javascript</option>
      </select>
      <button type="submit">
        {#if isLoading}
        <div class="btn-loader"></div>
        {:else}
        Upload
        {/if}  
      </button>
    </form>
    
  </div>
  {:else}
  <p class="error">unable to fetch user </p>
  {/if}
<!-- Styling for the main content section -->
<style>
  .editor {
    margin-top: 100px;
  }
  .editor-container {
    font-size: 16px;
  }
  .btn-loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

  .btn-loader::after {
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


</style>
