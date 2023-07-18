<script>
  import { onMount } from 'svelte';

  import Navbar from "../../components/Navbar.svelte";

  let registerEmail;
  let registerMobile;
  let files = [];
  let registerFirstName;
  let registerLastName;
  let registerPassword;
  let registerConfirmPassword;

  async function handleRegister(event) {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", registerEmail);
      formData.append("mobile", registerMobile);
      formData.append("profile_picture", files[0]);
      formData.append("first_name", registerFirstName);
      formData.append("last_name", registerLastName);
      formData.append("password", registerPassword);

     

      const response = await fetch(
        "https://devdox.up.railway.app/api/v1/user/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log("User registered successfully");
        registerEmail = "";
        registerMobile = "";
        files = [];
        registerFirstName = "";
        registerLastName = "";
        registerPassword = "";
        registerConfirmPassword = "";
      } else {
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Failed to register user", error);
    }
  }

  onMount(() => {
    // Code to run when the component is mounted
  });
</script>

<svelte:head>
  <title>DevDox - Register</title>
  <meta name="description" content="Create a new account on DevDox and start saving your code snippets." />
</svelte:head>

<Navbar />
<main class="container border main-cont">
  <h3 class="form-heading">Registration</h3>
  <form class="reg-container register-form" on:submit={handleRegister} enctype="multipart/form-data">
    <input
      placeholder="Enter Your Email"
      type="email"
      bind:value={registerEmail}
    />
    <input
      placeholder="Enter Your Mobile"
      type="number"
      bind:value={registerMobile}
    />
    <input placeholder="" type="file" bind:files />
    <input
      placeholder="Enter Your First Name"
      type="text"
      bind:value={registerFirstName}
    />
    <input
      placeholder="Enter Your Last Name"
      type="text"
      bind:value={registerLastName}
    />
    <input
      placeholder="Password"
      type="password"
      bind:value={registerPassword}
    />
    <input
      placeholder="Confirm Password"
      type="password"
      bind:value={registerConfirmPassword}
    />
    <button type="submit">Register</button>
  </form>
</main>
