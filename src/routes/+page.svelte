<!-- Snippets.svelte -->

<script>
  import Navbar from "../components/Navbar.svelte";
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  import Footer from "../components/Footer.svelte";

  export let snippets;
  let isLoading = false;
  let value;
</script>
<svelte:head>
  <title>DevDox - Home | Save and Run Your Code Snippets</title>

  <meta name="description" content="Welcome to DevDox, the platform to save and run your code snippets. Start organizing and executing your code efficiently with DevDox." />
  <meta property="og:title" content="DevDox - Home" />
  <meta property="og:description" content="Welcome to DevDox, the platform to save and run your code snippets. Start organizing and executing your code efficiently with DevDox." />
  <meta property="og:image" content="https://devdox.kasimsaifi.tech/images/founder.png" />
  <meta property="twitter:title" content="DevDox - Home" />
  <meta property="twitter:description" content="Welcome to DevDox, the platform to save and run your code snippets. Start organizing and executing your code efficiently with DevDox." />
  <meta property="twitter:image" content="https://devdox.kasimsaifi.tech/founder.png" />
  
</svelte:head>


<!-- Rendering the Navbar component -->
<Navbar />

<!-- Main content section -->
<div class="card-div">
  {#if isLoading}
    <!-- Show loader while fetching data -->
    <div class="loader" />
  {:else if snippets && snippets.length > 0}
    <!-- Displaying a list of snippets using CSS Grid -->
    <div class="card-container">
      {#each snippets as snippet (snippet.id)}
        <a href={"/snippet/" + snippet.slug}>
          <div class="card">
            <h4>{snippet.title}</h4>
            <div class="card-content editor-container">
              <CodeMirror
                bind:value={snippet.code_snippet}
                lang={snippet.language === "javascript" ? javascript() : python()}
                styles={{
                  "&": {
                    width: "400px",
                    height: "400px",
                  },
                }}
                theme={oneDark}
                readonly
              />
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <!-- If no snippets are found, display a message -->
    <p>No snippets found.</p>
  {/if}
</div>

<Footer />
