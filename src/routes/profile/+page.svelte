<!-- profile.page.svelte -->
<script>
  import { onMount } from "svelte";
  import { getCookie } from "../../utils/cookies.js";
  import { goto } from "$app/navigation";
  import Navbar from "../../components/Navbar.svelte";
  import MySnippets from "../../components/MYSnippets.svelte";
  import { fetchUser , fetchSnippets } from "../../utils/fetchData.js";
    import Footer from "../../components/Footer.svelte";
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
<svelte:head>
  <title>DevDox - Profile</title>
  <meta name="description" content="View and update your DevDox profile information." />
</svelte:head>

<Navbar />
<main>
  {#if isLoading}
    <div class="loader" />
  {:else if user}
    <div class="profile ">
      <img
        class="profile-picture"
        src={user.profile_picture}
        alt=""
        role="presentation"
      />
      <div class="user-details">
        <h2>{userName.full_name} <a href="profile/update"><i class="fas fa-edit" /></a> </h2>
        <p class="username">{user.username}</p>
        <p class="mobile">Mobile: {user.mobile}</p>
        <div class="problem-stats">
          <div class="problem-stat">
            <a href="/mysnippets">
            
              <h2>{snippetsCount.length}</h2>
            </a>
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

<style>
  i{
    font-size: 16px;
  }
</style>