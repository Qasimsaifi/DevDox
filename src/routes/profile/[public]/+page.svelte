<script>
  import { page } from "$app/stores";
  import Navbar from "../../../components/Navbar.svelte";
  import { onMount } from "svelte";
  import { getCookie } from "../../../utils/cookies";
  import { goto } from "$app/navigation";
  let user;
  let isLoading = true;
  let myUser;
  async function getUser() {
    const user = await fetchUser();
    return user;
  }

  import { fetchPublicUser, fetchUser } from "../../../utils/fetchData";
  async function getPublicUser() {
    const user_id = $page.params.public;
    try {
      user = await fetchPublicUser(user_id);
    } catch (error) {
      console.error("Failed to fetch user data.", error);
    }
  }

  onMount(async () => {
    let accessToken = getCookie("access_token");

    if (!accessToken) {
      goto("/login");
    } else {
      isLoading = false;

      getPublicUser();
      myUser = await getUser();
      if (user && myUser) {
        if (user.id == myUser.id) {
          goto("/profile");
        }
      }
    }
  });
</script>

<Navbar />
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
