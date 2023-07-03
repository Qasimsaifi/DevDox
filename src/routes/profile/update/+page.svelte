<script>
  import { onMount } from "svelte";
  import { getCookie } from "../../../utils/cookies.js";
  import { goto } from "$app/navigation";
  import Navbar from "../../../components/Navbar.svelte";
  import MySnippets from "../../../components/MYSnippets.svelte";
  import { fetchUser, fetchSnippets } from "../../../utils/fetchData.js";
  import Footer from "../../../components/Footer.svelte";

  let user = {};
  let firstName = "";
  let lastName = "";
  let userName = "";
  let image = null;
  let files = [];
  let imagePreview = null;
  let isLoading = true;
  let isUpdating = false;
  let snippetsCount;
  let accessToken;

  async function getUser() {
    const user = await fetchUser();
    return user;
  }

  async function getSnippets(user_id) {
    const snippetsCount = await fetchSnippets(user_id);
    return snippetsCount;
  }

  async function updateUser(updatedUser) {
    isUpdating = true;
    const accessToken = getCookie("access_token");

    try {
      const formData = new FormData();
      formData.append("first_name", updatedUser.first_name);
      formData.append("last_name", updatedUser.last_name);
      formData.append("username", updatedUser.username);
      formData.append("mobile", updatedUser.mobile);
      if (updatedUser.profile_picture) {
        formData.append("profile_picture", updatedUser.profile_picture);
      }

      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/user/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      return response;
    } catch (error) {
      console.error("Failed to update user", error);
    }
  }

  async function handleUpdateProfile(event) {
    event.preventDefault();

    try {
      const updatedUser = {
        first_name: firstName,
        last_name: lastName,
        username: userName,
        mobile: user.mobile,
        profile_picture: files[0],
        // Add more properties for other profile details
      };

      const response = await updateUser(updatedUser);

      if (response.ok) {
        console.log("User profile updated successfully");
        isUpdating = false;
      } else {
        console.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Failed to update user profile", error);
    }
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    image = file;
    imagePreview = URL.createObjectURL(file);
    files = [file];
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    image = file;
    imagePreview = URL.createObjectURL(file);
    files = [file];
  }

  // Call the getUser function
  onMount(async () => {
    accessToken = getCookie("access_token");

    if (!accessToken) {
      goto("/login");
    } else {
      user = await getUser();

      firstName = user.name.first_name;
      lastName = user.name.last_name;
      userName = user.username;
      snippetsCount = await getSnippets(user.id);
      isLoading = false;
    }
  });
  function myFile() {
    document.getElementById("file_image").click();
  }
</script>

<Navbar />
<main>
  {#if isLoading}
    <div class="loader" />
  {:else if user}
    <div class="profile">
      {#if imagePreview}
        <img
        on:dragover={handleDragOver} on:click={myFile}
        on:drop={handleDrop}
          class="profile-picture"
          src={imagePreview}
          alt=""
          role="presentation"
        />
      {:else}
        <img
        on:dragover={handleDragOver} on:click={myFile}
        on:drop={handleDrop}
          class="profile-picture"
          src={user.profile_picture}
          alt=""
          role="presentation"
        />
      {/if}
      <div class="user-details">
        <h2>{firstName} {lastName}</h2>
        <p class="username">{userName}</p>
        <p class="mobile">Mobile: {user.mobile}</p>
        <div class="problem-stats">
          <div class="problem-stat">
            <a href="/mysnippets">
              <h2>{snippetsCount.length}</h2>
            </a>
            <p>Your Snippets</p>
          </div>
          <div class="problem-stat">
            <h2>{snippetsCount.length}</h2>
            <p>Saved Snippets</p>
          </div>
        </div>
        <!-- Display other user details as needed -->
      </div>
    </div>
    <div class="edit-profile">
      <h3>Edit Profile</h3>
      <form
        on:submit|preventDefault={handleUpdateProfile}
        enctype="multipart/form-data"
      >
        <input type="text" bind:value={firstName} placeholder="First Name" />
        <input type="text" bind:value={lastName} placeholder="Last Name" />
        <input type="text" bind:value={userName} placeholder="Username" />
        <input type="number" bind:value={user.mobile} />
        <div class="drag-drop">
          <input
            id="file_image"
            type="file"
            bind:files
            on:change={handleImageChange}
          />
          <div
            class="drag-drop-label"
            on:dragover={handleDragOver} on:click={myFile}
            on:drop={handleDrop} role="presentation"
          >
            Drag and drop file here or click to upload
          </div>
        </div>
        <!-- Add more input fields for other profile details -->
        <button type="submit">
          {#if isUpdating}
            <div class="btn-loader" />
          {:else}
            update
          {/if}
        </button>
      </form>
    </div>
  {:else}
    <p class="error">Failed to fetch user data.</p>
  {/if}
</main>
<Footer />

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

  form {
    margin-bottom: 70px;
  }

  img {
    cursor: pointer;
  }

  #file_image {
    display: none;
  }

  input {
    display: inline-block;
    width: 48%;
  }

  .drag-drop {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .drag-drop-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #999;
    cursor: pointer;
  }

  .drag-drop-label:hover {
    background-color: #f5f5f5;
  }
</style>
