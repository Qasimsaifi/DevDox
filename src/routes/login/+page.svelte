<script>
  import { setCookie, getCookie, deleteCookie } from '../../utils/cookies'; // Import cookie utility functions
  import Navbar from '../../components/Navbar.svelte';
  let email = '';
  let password = '';
  let error = '';
  export let isLoggedIn = false;

  function checkLoggedIn() {
    const accessToken = getCookie('access_token');
    isLoggedIn = !!accessToken;
  }

  async function handleLogin() {
    try {
      const response = await fetch('https://blogaxis-api.up.railway.app/api/v1/snippets/gettoken/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access;
        setCookie('access_token', accessToken);
        isLoggedIn = true;
        error = '';
      } else {
        error = 'Invalid email or password';
      }
    } catch (e) {
      error = 'An error occurred during login';
    }
  }

  function handleLogout() {
    deleteCookie('access_token');
    isLoggedIn = false;
  }

  // Check if the user is already logged in on page load
  checkLoggedIn();
</script>

<Navbar {isLoggedIn} />

<main>
  {#if isLoggedIn}
    <h1>Welcome back!</h1>
    <button on:click="{handleLogout}">Logout</button>
    <!-- Display the logged-in content here -->
  {:else}
    <h1>Login</h1>

    {#if error}
      <p>{error}</p>
    {/if}

    <form on:submit="{handleLogin}">
      <label>
        Email:
        <input type="email" bind:value="{email}" required />
      </label>

      <label>
        Password:
        <input type="password" bind:value="{password}" required />
      </label>

      <button type="submit">Login</button>
    </form>
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  input,
  button {
    margin-top: 10px;
  }
</style>
