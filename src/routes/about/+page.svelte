<!-- About.svelte -->
<script>
  export let name = 'DevDox';
  export let description = 'Welcome to DevDox, your ultimate resource for saving, sharing, and discovering code snippets!';
  export let founder = 'Kasim Saifi';
  export let yearFounded = 2023;
  import logo from "$lib/image/logo.png";
    import Footer from "../../components/Footer.svelte";
  export let mission = 'To provide developers with a powerful platform for storing, exploring, and collaborating on code snippets.';
  export let founderImage = 'founder.png'; // Replace with your founder's image file
  import Navbar from "../../components/Navbar.svelte";

</script>
<Navbar/>

<main class="main-container">
  <div class="container">
    <h1>About {name}</h1>
    <p class="description">{description}</p>
    <div class="info">
      <div class="left-section">
        <img src={logo} alt="DevDox Logo" class="logo" />
        <img src={founderImage} alt="Founder" class="founder-image" />
      </div>
      <div class="right-section">
        <h2>Our Story</h2>
        <p>
          DevDox was founded in {yearFounded} by {founder} with the mission to revolutionize the way developers save, share, and discover code snippets. Our founders recognized the need for a centralized platform where developers can efficiently organize their code and collaborate with peers. DevDox was born to meet these demands and empower developers worldwide.
        </p>
        <h2>Our Mission</h2>
        <p>{mission}</p>
        <h2>What We Offer</h2>
        <ul>
          <li>Code Snippet Management: Save and categorize your code snippets for easy access and future reference.</li>
          <li>Syntax Highlighting: View and edit code snippets with syntax highlighting to improve readability and understanding.</li>
          <li>Online Code Editor with Compiler: Experiment with code and test it directly within DevDox using our integrated online code editor and compiler.</li>
          <li>Snippet Sharing: Upload and manage your private or public snippets, making them accessible to the DevDox community.</li>
          <li>Snippet Discovery: Explore a vast collection of snippets contributed by the community, discovering new solutions and techniques.</li>
          <li>Blogging Platform: Share your insights and knowledge through blog articles, providing valuable resources to fellow developers.</li>
          <li>Profile and Public Profile: Create a profile and public profile to showcase your work, skills, and contributions to the developer community.</li>
        </ul>
        <p>
          At DevDox, we are committed to enabling developers to reach their full potential by fostering collaboration, knowledge sharing, and continuous learning. Join us today and unlock the power of collective programming wisdom.
        </p>
      </div>
    </div>
  </div>
</main>
<Footer/>
<style>
  .main-container {
    padding: 2rem;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .description {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
    text-align: center;
  }

  .info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .left-section {
    width: 100%;
    margin-bottom: 2rem;
    text-align: center;
  }

  .logo {
    width: 200px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .founder-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .right-section {
    flex: 1;
  }

  h2 {
    font-size: 2.2rem;
    margin-bottom: 1rem;
    color: #333;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 1.5rem;
    color: #666;
  }

  li {
    position: relative;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
    line-height: 1.5;
  }

  li:before {
    content: '';
    position: absolute;
    top: 0.5rem;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: #777;
    border-radius: 50%;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
    color: #777;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1.5rem;
    }

    h1 {
      font-size: 2.5rem;
    }

    .logo {
      width: 150px;
    }

    .founder-image {
      width: 120px;
      height: 120px;
    }

    h2 {
      font-size: 2rem;
    }

    ul {
      margin-bottom: 1rem;
    }
  }
</style>
