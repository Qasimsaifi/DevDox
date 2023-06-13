<!-- login.page.svelte -->
<script>
  import { setCookie, getCookie, deleteCookie } from '../../utils/cookies';
  import { goto } from '$app/navigation';
  import Navbar from '../../components/Navbar.svelte';

  let email = '';
  let password = '';
  let error = '';
  export let isLoggedIn = false;

  function checkLoggedIn() {
    const accessToken = getCookie('access_token');
    isLoggedIn = !!accessToken;
    if (isLoggedIn) {
      goto('/');
    }
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
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 60); // Set the expiration date to 7 days from now
        setCookie('access_token', accessToken, { expires: expirationDate });
        isLoggedIn = true;
        goto('/');
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
    <!-- Display the logged-in content here -->
  {:else}
    <h1>Login</h1>

    {#if error}
      <p class="error">{error}</p>
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

      <button class="login-btn" type="submit">Login</button>
    </form>
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    margin-top: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .login-btn {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 20px;
    cursor: pointer;
  }

  .error {
    color: #dc3545;
    margin-top: 10px;
  }
</style>
