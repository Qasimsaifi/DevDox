<script>
  import logo from '$lib/image/logo.png'
  import { onMount } from 'svelte';

  let isNavOpen = false;

  onMount(() => {
    const navbarToggle = document.getElementById('navbar-toggle');

    navbarToggle.addEventListener('click', () => {
      isNavOpen = !isNavOpen;
    });

    document.addEventListener('click', (event) => {
      if (!navbarToggle.contains(event.target)) {
        isNavOpen = false;
      }
    });
  });
</script>

<section class="navigation">
  <div class="nav-container">
    <div class="brand">
      <a href="/"><img src={logo} alt=""></a>
    </div>
    <nav>
      <div class="nav-mobile">
        <a id="navbar-toggle" href="/" class:active={isNavOpen}>
          <span></span>
        </a>
      </div>
      <ul class="nav-list" style="display: {isNavOpen ? 'block' : 'none'};">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/">About</a>
        </li>
        <li>
          <a href="/">Contact</a>
        </li>
        <li>
          <a href="/">Login</a>
        </li>
        <li>
          <a href="/">Upload Snippet</a>
        </li>
        <li>
          <a href="/">My Snippets</a>
        </li>
      </ul>
    </nav>
  </div>
</section>

<style>
  .navigation {
    height: 55px;
    background: linear-gradient(45deg, #525252, #414141);
  }

  .brand {
    position: absolute;
    padding-left: 20px;
    float: left;
    line-height: 55px;
    text-transform: uppercase;
    font-size: 1.4em;
  }

  .brand img {
    height: 30px; /* Adjust the height as needed */
    vertical-align: middle;
  }
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  nav {
    float: right;
  }

  nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  nav ul li {
    float: left;
    position: relative;
  }

  nav ul li a,
  nav ul li a:visited {
    display: block;
    padding: 0 20px;
    line-height: 55px;
    color: #fff;
    background: #262626;
    text-decoration: none;
    transition: border-bottom 0.3s ease;
  }

  nav ul li a {
    background: transparent;
    color: #fff;
    border-bottom: 2px solid transparent;
  }

  nav ul li a:hover,
  nav ul li a:visited:hover {
    color: #ffffff;
    background-color: #CA3E47;
    height: 55px;
  }

  nav ul li ul li {
    min-width: 190px;
  }

  nav ul li ul li a {
    padding: 15px;
    line-height: 20px;
  }

  .nav-mobile {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    height: 55px;
    width: 70px;
  }

  @media only screen and (max-width: 800px) {
    .nav-mobile {
      display: block;
    }

    nav {
      width: 100%;
      padding: 55px 0 15px;
    }

    nav ul {
      display: none;
    }

    nav ul li {
      float: none;
    }

    nav ul li a {
      padding: 15px;
      line-height: 20px;
      background: #262626;
    }

    nav ul li ul li a {
      padding-left: 30px;
    }
  }

  @media screen and (min-width: 800px) {
    .nav-list {
      display: block !important;
    }
  }

  #navbar-toggle {
    position: absolute;
    left: 18px;
    top: 15px;
    cursor: pointer;
    padding: 10px 35px 16px 0px;
  }

  #navbar-toggle span,
  #navbar-toggle span:before,
  #navbar-toggle span:after {
    cursor: pointer;
    border-radius: 1px;
    height: 3px;
    width: 30px;
    background: #ffffff;
    position: absolute;
    display: block;
    content: '';
    transition: all 300ms ease-in-out;
  }

  #navbar-toggle span:before {
    top: -10px;
  }

  #navbar-toggle span:after {
    bottom: -10px;
  }

  #navbar-toggle.active span {
    background-color: transparent;
  }

  #navbar-toggle.active span:before,
  #navbar-toggle.active span:after {
    top: 0;
  }

  #navbar-toggle.active span:before {
    transform: rotate(45deg);
    top: 0;
  }

  #navbar-toggle.active span:after {
    transform: rotate(-45deg);
    top: 0;
  }
</style>
