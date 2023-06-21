<script>
  import { onMount, afterUpdate } from 'svelte';
  import { goto } from '$app/navigation';
  import { getCookie } from '../../../utils/cookies';
  import { page } from '$app/stores';
  import Navbar from '../../../components/Navbar.svelte';

  let loading = true;
  let data = null;
  let comments = [];
  let user = [];
  let userInfo = [];
  const dataSlug = $page.params.snippetSlug;

  onMount(async () => {
    fetchUser();
    fetchData();
  });

  async function fetchUser() {
    let accessToken = getCookie("access_token")
    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        user = data;
        userInfo = data.name;
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
    }
  }
  const fetchData = async () => {
    let accessToken = getCookie("access_token")

    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/snippets/snippet/?slug=${dataSlug}`,{
        method: "GET",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      });
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
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
    document.head.appendChild(script);
  }

  // Function to fetch comments for the specific snippet
  async function fetchComments() {
    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/snippets/comments/?ordering=created_at&snippet=${data.id}`);
      const responseData = await response.json();
      comments = responseData;
      
      // Scroll to the bottom of the comments section
      const commentsContainer = document.querySelector('.comments-section');
      commentsContainer.scrollTop = commentsContainer.scrollHeight;
    } catch (error) {
      console.error(error);
    }
  }

  // Function to handle comment submission
  async function submitComment(event) {
    event.preventDefault();
    const commentContent = event.target.elements.comment.value;
    try {
      const response = await fetch('https://devdox.up.railway.app/api/v1/snippets/comments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          snippet: data.id,
          author : user.id,
          author_name : userInfo.full_name,
          author_email : user.email,
          author_picture : user.profile_picture,
          content: commentContent
        })
      });

      if (response.ok) {
        console.log(user.id)
        event.target.elements.comment.value = ''; // Clear the comment input field
        fetchComments(); // Fetch comments again to update the UI
      } else {
        console.error('Comment submission failed');
        console.log(user.id)
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
  <div class="card">
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
  <div class="comments-section">
    <h4>Comments</h4>
    {#each comments as comment (comment.id)}
      <div class="comment">
        <div class="comment-content">
          <p class="comment-text">{comment.content}</p>
        </div>
      </div>
    {/each}
    <form on:submit={submitComment}>
      <div class="comment-input">
        <input type="text" name="comment" placeholder="Enter your comment" />
        <button type="submit">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </form>
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
.card {
  padding: 20px;
  margin-bottom: 20px;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #fff;
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

/* Comments section */
.comments-section {
  margin-top: 20px;
  margin-bottom: 50px;
  width: 80vw;
  margin-right: auto;
  margin-left: auto;
  overflow-y: auto; /* Enable vertical scrolling */
}

.comments-section h4 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #fff;
}

.comments-section .comment {
  display: flex;
  margin-top: 5px;
  height: 25px;
}

.comments-section .comment-content {
  display: flex;
  flex-direction: column;
}

.comments-section .comment-text {
  font-size: 18px;
  color: #0c0c0c;
}

/* Comment input */
.comment-input {
  display: flex;
  align-items: center;
  margin-top: 10px;
  border: 2px solid #007bff;
  border-radius: 7px;
}

.comment-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

.comment-input button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}

.comment-input button i {
  margin-right: 5px;
}
</style>
