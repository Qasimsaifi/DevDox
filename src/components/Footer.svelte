<!-- Footer.svelte -->
<script>
  import { onMount } from "svelte";

  let currentYear;

  onMount(() => {
    const date = new Date();
    currentYear = date.getFullYear();
  });
</script>

<footer class="footer">
  <div class="container">
    <p class="text-center">&copy; {currentYear} DevDox. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f5f5f5;
    padding: 10px;
    text-align: center;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .text-center {
    text-align: center;
    margin-bottom: 0;
  }
</style>
