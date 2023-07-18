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
    import Footer from "../../../components/Footer.svelte";

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

  function timeSince(timestamp) {
    const date = new Date(timestamp);
    const seconds = Math.floor((Date.now() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} year${interval !== 1 ? 's' : ''} ago`;
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} month${interval !== 1 ? 's' : ''} ago`;
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} day${interval !== 1 ? 's' : ''} ago`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} hour${interval !== 1 ? 's' : ''} ago`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} minute${interval !== 1 ? 's' : ''} ago`;
    }

    return `${Math.floor(seconds)} second${seconds !== 1 ? 's' : ''} ago`;
  }
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
  async function deleteSnippet(snippetId) {
  const firstConfirmation = confirm("Are you sure you want to delete this snippet? This action cannot be undone.");
  if (!firstConfirmation) {
    return;
  }
  
  const secondConfirmation = confirm("This action is irreversible. Please confirm once again that you want to delete this snippet.");
  if (!secondConfirmation) {
    return;
  }
  
  isLoading = true;
  
  try {
    const response = await fetch(
      `https://devdox.up.railway.app/api/v1/snippets/snippet/${snippetId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204) {
      // Snippet deleted successfully
      goto('/');
    } else if (response.ok) {
      const data = await response.json();
    } else {
      throw new Error("Failed to delete snippet");
    }

    isLoading = false;
  } catch (error) {
    console.error("Failed to delete snippet", error);
  }
}




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
<title>DevDox - Snippet | Code Snippet Repository</title>
    <meta name="description" content="Explore a collection of user and public code snippets on DevDox. Find inspiration and save snippets for your projects." />
    <meta property="og:title" content="DevDox - Snippets | Code Snippet Repository" />
    <meta property="og:description" content="Explore a collection of user and public code snippets on DevDox. Find inspiration and save snippets for your projects." />
    <meta property="og:image" content="https://devdox.kasimsaifi.tech/images/devdox-snippets.png" />
    <meta property="twitter:title" content="DevDox - Snippets | Code Snippet Repository" />
    <meta property="twitter:description" content="Explore a collection of user and public code snippets on DevDox. Find inspiration and save snippets for your projects." />
    <meta property="twitter:image" content="https://devdox.kasimsaifi.tech/images/devdox-snippets.png" />
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
            <button on:click={deleteSnippet(data.id)} class="copy-btn">           
                <i class="fas fa-trash" />
            </button>
            <button class="copy-btn">
              <a href={"/update/" + data.slug}>
                <i class="fas fa-edit" />
              </a>
            </button>
            {/if}
            {#if data.language == "python"}
              
            <button class="copy-btn">
              <a href={"/editor/" + data.slug}>
                <i class="fas fa-play" />
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
            <div class="comment-date">{timeSince(comment.created_at)}</div>
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

<Footer/>
<style>
  form{
    margin-bottom: 70px;
  }
</style>