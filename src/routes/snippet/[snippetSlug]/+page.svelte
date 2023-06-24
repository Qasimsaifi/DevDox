<script>
  import { onMount, afterUpdate } from "svelte";
  import { goto } from "$app/navigation";
  import { getCookie } from "../../../utils/cookies";
  import { page } from "$app/stores";
  import Navbar from "../../../components/Navbar.svelte";
  import { fetchUser } from "../../../utils/fetchData";
  import { postAuthData } from "../../../utils/authReq";
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";

  let isLoading = true;
  let data = null;
  let comments = [];
  let user;
  let userInfo;
  const dataSlug = $page.params.snippetSlug;
  let commentContent;
  let value;
  let accessToken = getCookie("access_token");
  onMount(async () => {
    if (accessToken) {
      fetchData();
      user = await fetchUser();
      userInfo = user.name;
    }
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/snippet/?slug=${dataSlug}`,
        {
          method: "GET",
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
      const responseData = await response.json();
      data = responseData[0];
      const code = data.code_snippet;
      value = code.replace(/<\/?(?:pre|code)[^>]*>/g, "");
      fetchComments(); // Fetch comments for the specific snippet
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  function copySnippet(code, event) {
    // Extract the code snippet without <pre> and <code> tags
    const extractedCode = code.replace(/<\/?(?:pre|code)[^>]*>/g, "");

    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    textarea.value = extractedCode;

    // Append the textarea to the body
    document.body.appendChild(textarea);

    // Select the textarea and copy its contents
    textarea.select();
    document.execCommand("copy");

    // Remove the textarea from the body
    document.body.removeChild(textarea);

    // Update all the copy buttons' icons
    const copyButtons = document.querySelectorAll(".copy-button");
    copyButtons.forEach((button) => {
      const icon = button.querySelector("i");
      icon.classList.remove("fa-check");
      icon.classList.add("fa-copy");
    });

    // Toggle the icon classes to show the "Copied" icon for the clicked button
    const button = event.target;
    const icon = button.querySelector("i");
    icon.classList.remove("fa-copy");
    icon.classList.add("fa-check");

    // Reset the icon after a certain time (e.g., 2 seconds)
    setTimeout(() => {
      icon.classList.remove("fa-check");
      icon.classList.add("fa-copy");
    }, 2000);
  }

  // Function to fetch comments for the specific snippet
  async function fetchComments() {
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/comments/?ordering=-created_at&snippet=${data.id}`
      );
      const responseData = await response.json();
      comments = responseData;
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle comment submission
  async function submitComment(event) {
    event.preventDefault();

    try {
      let formData = JSON.stringify({
        snippet: data.id,
        author: user.id,
        author_name: userInfo.full_name,
        author_email: user.email,
        author_picture: user.profile_picture,
        content: commentContent,
      });

      postAuthData(
        "https://devdox.up.railway.app/api/v1/snippets/comments/",
        formData,
        "POST"
      );
      fetchComments();
      commentContent = "";
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Navbar />

{#if isLoading}
  <div class="loader" />
{:else if data}
  <div class="container card-cont">
    <div class="">
      <h4>{data.title}</h4>
      <div>{@html data.content}</div>
      <main class="code-snippet">
        <div class="snip-btn">
          {#if user && data.author == user.id}
            <button class="copy-btn">
              <a href={"/update/" + data.slug}>
                <i class="fas fa-trash" />
              </a>
            </button>
            <button class="copy-btn">
              <a href={"/update/" + data.slug}>
                <i class="fas fa-edit" />
              </a>
            </button>
          {/if}
          <button
            class="copy-button copy-btn"
            on:click={(event) => copySnippet(data.code_snippet, event)}
          >
            <i class="fas fa-copy" />
          </button>
        </div>
        <div class="editor-container contaner">
          <CodeMirror
            bind:value
            lang={data.language === "javascript" ? javascript() : python()}
            styles={{
              "&": {
                width: "100%",
                height: "80vh",
              },
            }}
            theme={oneDark}
            readonly
          />
        </div>
      </main>
    </div>
  </div>

  <!-- comments -->

  <div class="comments-section container">
    <h3 class="attractive-heading">Comments</h3>
    {#each comments as comment (comment.id)}
      <div class="comment">
        <a href={`/profile/${comment.author}`}>
          <img class="comment-avatar" src={comment.author_picture} alt="" />
        </a>
        <div class="comment-content">
          <div class="comment-header">
            <a href={`/profile/${comment.author}`}>
              <div class="comment-author">{comment.author_name}</div>
            </a>
            <div class="comment-date">{comment.created_at}</div>
          </div>
          <div class="comment-text">
            <p>{comment.content}</p>
          </div>
        </div>
      </div>
    {/each}
    {#if user}
      <div class="comment-form">
        <h3>Add a Comment</h3>
        <form on:submit={submitComment}>
          <div class="form-group input-with-button">
            <input
              bind:value={commentContent}
              type="text"
              id="comment"
              name="comment"
              required
            />
            <button class="button-com icon" type="submit">
              <i class="fas fa-paper-plane" />
            </button>
          </div>
        </form>
      </div>
    {:else}
      <h6 class="border radius">
        Login for comment <a href="/login">Login</a>
      </h6>
    {/if}
  </div>
{:else}
  <p>Not found</p>
{/if}

<style>
  /* Loading message */
  p {
    font-size: 20px;
  }
  a {
    background-image: #ffffff !important;
  }
  /* Card */
  .card-cont {
    border-radius: 10px;
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
    /* color: #fff; */
    margin-top: 120px;
  }

  /* Card title */
  .card-cont h4 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  .snip-btn {
    display: flex;
    justify-content: space-around !important;
    align-items: center;
  }

  /* Copy button */
  .copy-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-left: auto;
    margin-right: auto;
    width: 40px;
    justify-content: center;
  }
  .snip-btn a {
    color: #ffffff;
  }
  a {
    background-image: none !important;
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

  .comments-section {
    margin: 0 auto;
    padding: 20px;
  }

  .comment {
    display: flex;
    margin-bottom: 20px;
  }

  .comment-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .comment-content {
    flex-grow: 1;
  }

  .comment-header {
    display: flex;
    align-items: center;
  }

  .comment-author {
    font-weight: bold;
    margin-right: 10px;
  }

  .comment-date {
    font-size: 12px;
    color: #888;
  }

  .comment-text {
    margin-top: 5px;
  }

  .comment-form {
    margin-top: 20px;
  }

  .comment-form .input-with-button {
    position: relative;
    border: 2px solid #6e6f74;
    border-radius: 5px;
  }

  .comment-form input[type="text"] {
    background: transparent;
    border: none;
    height: 100%;
    outline: none;
    display: inline-block;
    width: 87%;
  }

  .comment-form .icon {
    color: #464646;
    border: none;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    display: inline-block;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .comment-form input[type="text"] {
      width: 70%;
    }
  }

  .attractive-heading {
    margin-bottom: 20px;
  }
</style>
