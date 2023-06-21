<script>
  import { onMount, afterUpdate } from "svelte";
  import { goto } from "$app/navigation";
  import { getCookie } from "../../../utils/cookies";
  import { page } from "$app/stores";
  import Navbar from "../../../components/Navbar.svelte";

  let loading = true;
  let data = null;
  let comments = [];
  let user;
  let userInfo = [];
  const dataSlug = $page.params.snippetSlug;
  let commentContent;

  onMount(async () => {
    fetchUser();
    fetchData();
  });

  async function fetchUser() {
    let accessToken = getCookie("access_token");
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        user = data;
        userInfo = data.name;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    } finally {
    }
  }
  const fetchData = async () => {
    let accessToken = getCookie("access_token");

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
      data = responseData.results[0];
      fetchComments(); // Fetch comments for the specific snippet
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  };

  afterUpdate(() => {
    if (data) {
      initializePrism();
    }
  });

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

  function initializePrism() {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js";
    document.head.appendChild(script);
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
    let accessToken = getCookie("access_token");

    event.preventDefault();
    try {
      const response = await fetch(
        "https://devdox.up.railway.app/api/v1/snippets/comments/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            snippet: data.id,
            author: user.id,
            author_name: userInfo.full_name,
            author_email: user.email,
            author_picture: user.profile_picture,
            content: commentContent,
          }),
        }
      );

      if (response.ok) {
        console.log(user.id);
        event.target.elements.comment.value = ""; // Clear the comment input field
        fetchComments(); // Fetch comments again to update the UI
      } else {
        console.error("Comment submission failed");
        console.log(user.id);
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Navbar />

{#if loading}
  <p>Loading...</p>
{:else if data}
  <div class="container card-cont">
    <div class="">
      <h4>{data.title}</h4>
      <div>{@html data.content}</div>
      <main class="code-snippet">
  <button
    class="copy-button"
    on:click={(event) => copySnippet(data.code_snippet, event)}
  >
    <i class="fas fa-copy" />
  </button>

  {@html data.code_snippet}
</main>
    </div>
  </div>

  <!-- comments -->

  <div class="comments-section container">
    <h3 class="attractive-heading">Comments</h3>
    {#each comments as comment (comment.id)}
      <div class="comment">
        <img
          class="comment-avatar"
          src={comment.author_picture}
          alt=""
        />
        <div class="comment-content">
          <div class="comment-header">
            <div class="comment-author">{comment.author_name}</div>
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
            <input bind:value={commentContent} type="text" id="comment" name="comment" required />
            <button class="button-com icon" type="submit">
              <i class="fas fa-paper-plane"></i>
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
