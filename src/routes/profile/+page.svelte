<!-- profile.page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { getCookie } from '../../utils/cookies.js';
  import { goto } from '$app/navigation';
  import Navbar from '../../components/Navbar.svelte';
  import logo from '$lib/image/logo.png';
  import MySnippets from '../../components/MYSnippets.svelte';
  let user = {};
  let userName = {};
  let isLoading = true;

  let accessToken;

  onMount(async () => {
    accessToken = getCookie('access_token');

    if (!accessToken) {
      goto('/login');
    } else {
      fetchUser();
    }
  });

  async function fetchUser() {
    try {
      const response = await fetch(`https://devdox.up.railway.app/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        user = data;
        userName = data.name;
        console.log(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<Navbar/>
<main>
  {#if isLoading}
    <div class="loader"></div>
  {:else if user}
    <div class="profile">
      <img class="profile-picture" src={user.profile_picture} alt="" role="presentation"/>
      <div class="user-details">
        <h2>{userName.full_name}</h2>
        <p class="username">{user.email}</p>
        <p class="mobile">Mobile: {user.mobile}</p>
        <!-- Display other user details as needed -->
      </div>
      
    </div>
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</main>
<MySnippets/>
<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
  }

  .loader::after {
    content: '';
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
  
  .profile {
    margin-top: 32%;
    text-align: center;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin: -75px auto 20px;
    border: 4px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .user-details {
    margin-top: 20px;
  }

  .user-details h2 {
    font-size: 24px;
    margin-bottom: 5px;
    color: #333;
  }

  .user-details .username {
    font-size: 16px;
    color: #888;
    margin-bottom: 5px;
  }

  .user-details .mobile {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  p.error {
    text-align: center;
    margin-top: 20px;
    color: #f00;
  }

  /* Responsive Styles */
  @media (max-width: 600px) {
    .profile {
      padding: 10px;
    }

    .profile-picture {
      width: 100px;
      height: 100px;
      margin: -50px auto 10px;
    }

    .user-details h2 {
      font-size: 20px;
    }
  }
</style>
