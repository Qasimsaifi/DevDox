<!-- login.page.svelte -->
<script>
  import { setCookie, getCookie, deleteCookie } from "../../utils/cookies";
  import { goto } from "$app/navigation";
  import Navbar from "../../components/Navbar.svelte";

  let email = "";
  let password = "";
  let error = "";
  export let isLoggedIn = false;
  let isLoading = false;

  function checkLoggedIn() {
    const accessToken = getCookie("access_token");
    isLoggedIn = !!accessToken;
    if (isLoggedIn) {
      goto("/");
    }
  }

  async function handleLogin() {
    isLoading = true;
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/gettoken/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 60); // Set the expiration date to 7 days from now
        setCookie("access_token", accessToken, { expires: expirationDate });
        isLoggedIn = true;
        isLoading = false;
        goto("/");
        error = "";
      } else {
        error = "Invalid email or password";
      }
    } catch (e) {
      error = "An error occurred during login";
    }
  }

  function handleLogout() {
    deleteCookie("access_token");
    isLoggedIn = false;
  }

  // Check if the user is already logged in on page load
  checkLoggedIn();
</script>
<svelte:head>
  <title>DevDox - Login</title>
  <meta name="description" content="Login to your DevDox account and access your saved code snippets." />
</svelte:head>

<Navbar {isLoggedIn} />

<main class="container border log-cont">
  <h3 class="log-heading">Login</h3>
  {#if isLoggedIn}
    <!-- Display the logged-in content here -->
  {:else}
    {#if error}
      <p class="error">{error}</p>
    {/if}

    <form class="log-container log-form" on:submit={handleLogin}>
      <label>
        Email:
        <input type="email" bind:value={email} required />
      </label>

      <label>
        Password:
        <input type="password" bind:value={password} required />
      </label>

      <button type="submit">
        {#if isLoading}
          <div class="btn-loader" />
        {:else}
         Login
        {/if}</button
      >
    </form>
  {/if}
</main>
<style>
    .btn-loader {
  display: flex;
  justify-content: center;
  align-items: center;
}

  .btn-loader::after {
    content: "";
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #ccc;
    border-top-color: #888;
    animation: spin 1s linear infinite;
  }
</style>