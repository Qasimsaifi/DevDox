<script>
  import logo from "$lib/image/logo.png";
  import { onMount } from "svelte";
  import { getCookie, deleteCookie } from "../utils/cookies.js";
  import { fetchUser } from "../utils/fetchData.js";

  let isNavOpen = false;
  export let isLoggedIn = false;

  onMount(() => {
    const navbarToggle = document.getElementById("navbar-toggle");
    isLoggedIn = !!getCookie("access_token");
  });


  function handleLogout() {
    deleteCookie("access_token");
    isLoggedIn = false;
    location.reload();
  }
</script>

<nav class="border fixed split-nav">
  <div class="nav-brand">
    <a href="/" ><img class="logo-img" src={logo} alt=""></a>
  </div>
  <div class="collapsible">
    <input id="collapsible1" type="checkbox" name="collapsible1" />
    <label for="collapsible1">
      <div class="bar1" />
      <div class="bar2" />
      <div class="bar3" />
    </label>
    <div class="collapsible-body">
      <ul class="inline">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">About</a>
        </li>
        <li>
          <a href="/">Contact</a>
        </li>
        {#if isLoggedIn}
          <li>
            <a href="/uploadsnippet">Upload Snippet</a>
          </li>
          <li>
            <a href="/mysnippets">My Snippets</a>
          </li>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/" on:click={handleLogout}>Logout</a>
          </li>
        {:else}
          <li>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
