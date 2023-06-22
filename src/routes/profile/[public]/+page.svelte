<script>
  import { page } from "$app/stores";
    import Navbar from "../../../components/Navbar.svelte";
    let user;
    let userName;
    import { fetchPublicUser } from "../../../utils/fetchData";
    async function getPublicUser() {
      const user_id = $page.params.public;
    try {
      user = await fetchPublicUser(user_id);
      userName = user.name;
    } catch (error) {
      console.error('Failed to fetch user data.', error);
    }
  }
  getPublicUser()



</script>
<Navbar/>
<main>
  {#if user}
<div class="profile">
  <img
    class="profile-picture"
    src={`https://res.cloudinary.com/dehpkgdw5/${user.profile_picture}`}
    alt=""
    role="presentation"
  />
  <div class="user-details">
    <h2>{user.first_name} {user.last_name}</h2>
    
  </div>
</div>
  {:else}
  <div class="loader" />
{/if}
</main>
