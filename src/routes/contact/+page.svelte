<!-- Contact.svelte -->
<script>
    import Footer from "../../components/Footer.svelte";
import Navbar from "../../components/Navbar.svelte";

 
</script>
<Navbar/>
<main class="main-container">
  <div class="container">
    <h1>Contact {name}</h1>
    <p>If you have any questions, suggestions, or feedback, please feel free to reach out to us.</p>
    <form class="contact-form">
      <div class="form-group">
        <label for="name">Your Name</label>
        <input type="text" id="name" name="name" placeholder="Your name" required />
      </div>
      <div class="form-group">
        <label for="email">Your Email</label>
        <input type="email" id="email" name="email" placeholder="Your email" required />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Your message" required></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
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

  p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
    text-align: center;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .contact-form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  textarea {
    height: 120px;
  }

  button[type="submit"] {
    display: block;
    width: 100%;
    padding: 0.75rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    background-color: #333;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background-color: #555;
  }
</style>
