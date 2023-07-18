<script>
  import { onMount } from 'svelte';
  import { page } from "$app/stores";
  const resetToken = $page.params.token;

  let newPassword = '';
  let confirmPassword = '';

  async function resetPassword() {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/v1/user/forgot-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        token: resetToken,
      }),
    });

    if (response.ok) {
      console.log("passupdated")
      // Password reset s// Redirect to the login page or any other desired page
    } else {
      // Password reset failed
      const data = await response.json();
      alert(data.error || 'Password reset failed');
    }
  }
</script>

<main>
  <h1>Reset Password</h1>

  <form on:submit|preventDefault="{resetPassword}">
    <label>
      New Password:
      <input type="password" bind:value="{newPassword}" required />
    </label>

    <label>
      Confirm Password:
      <input type="password" bind:value="{confirmPassword}" required />
    </label>

    <button type="submit">Reset Password</button>
  </form>
</main>
