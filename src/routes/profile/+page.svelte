<!-- profile.page.svelte -->
<script>
  import { onMount } from "svelte";
  import { getCookie } from "../../utils/cookies.js";
  import { goto } from "$app/navigation";
  import Navbar from "../../components/Navbar.svelte";
  import MySnippets from "../../components/MYSnippets.svelte";
  import { fetchUser , fetchSnippets } from "../../utils/fetchData.js";
  let user = {};
  let userName = {};
  let isLoading = true;
  let snippetsCount;
  let accessToken;
  async function getUser() {
    const user = await fetchUser();
    return user;
    
  }
  async function getSnippets(user_id) {
    const snippetsCount = await fetchSnippets(user_id);
    return snippetsCount;
    
  }

  // Call the getUser function

  onMount(async () => {
    accessToken = getCookie("access_token");

    if (!accessToken) {
      goto("/login");
    } else {
      user = await getUser();
      userName = await user.name;
      snippetsCount = await getSnippets(user.id)
      isLoading = false;

      
    }
  });


</script>

<Navbar />
<main>
  {#if isLoading}
    <div class="loader" />
  {:else if user}
    <div class="profile">
      <img
        class="profile-picture"
        src={user.profile_picture}
        alt=""
        role="presentation"
      />
      <div class="user-details">
        <h2>{userName.full_name}</h2>
        <p class="username">{user.email}</p>
        <p class="mobile">Mobile: {user.mobile}</p>
        <div class="problem-stats">
          <div class="problem-stat">
            <h2>{snippetsCount.length}</h2>
            <p>Your Snippets</p>
          </div>
          <div class="problem-stat">
            <h2>{snippetsCount.length}</h2>
            <p>Saved Snippets</p>
          </div>
        </div>
        <!-- Display other user details as needed -->
      </div>
    </div>
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</main>
<MySnippets />


