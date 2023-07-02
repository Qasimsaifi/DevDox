<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import CodeMirror from "svelte-codemirror-editor";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { getCookie } from '../../../utils/cookies';
  import { page } from "$app/stores";
  import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';

  let accessToken = getCookie("access_token");
  const codeValue = $page.params.editor;

  onMount(async () => {
    fetchData();
  });

  let code;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://devdox.up.railway.app/api/v1/snippets/snippet/?slug=${codeValue}`,
        {
          method: "GET",
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );
      const responseData = await response.json();
      let data = responseData[0];
      code = data.code_snippet.replace(/<\/?(?:pre|code)[^>]*>/g, "");
      // Fetch comments for the specific snippet
    } catch (error) {
      console.error(error);
    }
  };

  let output = '';

  // Create a writable store for the output
  const outputStore = writable('');

  async function executeCode() {
    const inputRegex = /input\(\)/g;
    const inputMatches = code.match(inputRegex) || [];
    const inputCount = inputMatches.length;

    let inputValues = '';

    for (let i = 0; i < inputCount; i++) {
      const userInput = prompt(`Enter input ${i + 1}:`);
      if (userInput === null) {
        // Exit execution if the user cancels the input prompt
        return;
      }
      inputValues += userInput + '\n';
    }

    outputStore.set('');

    const response = await fetch('https://code-runner.up.railway.app/execute/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language: 'python',
        input: inputValues,
      }),
    });

    const data = await response.json();
    output = data.output;

    // Update the output store
    outputStore.set(output);
  }

  // // Shortcut key handler
  // function handleShortcut(event) {
  //   if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
  //     executeCode();
  //   }
  // }
  // document.addEventListener('keydown', handleShortcut);
</script>

<Navbar/>

<div class="containers">
  <div class="editor">
    <CodeMirror
      bind:value={code}
      lang={python()}
      styles={{
        "&": {
          width: "70vw",
          height: "85vh",
        },
      }}
      theme={oneDark}
    />
  </div>
  <div class="terminal">
    <button class="copy-btn" on:click={executeCode}>Run</button>
    <div class="output">
      <p>src/main.py</p>
      <pre>{$outputStore}</pre>
    </div>
  </div>
</div>
<Footer/>

<style>
.containers {
  display: flex;
  margin-top: 100px;
  width: 90vw;
  margin-left: auto;
  margin-right: auto;
}

.editor {
  flex: 1;
}

.output {
  overflow: auto;
}

.terminal {
  flex: 1;
  font-family: 'Courier New', monospace;
  background-color: #000;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  line-height: 1.5;
  white-space: pre;
  width: 25vw;
  height: 85vh;
}

/* Hide the scrollbar */
.output::-webkit-scrollbar {
  width: 0;
}

.output::-webkit-scrollbar-track {
  background-color: transparent;
}

.output::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 0.25em;
}

.output::-webkit-scrollbar-thumb:hover {
  background-color: transparent;
}

button {
  background-color: green;
  width: 60px;
}
</style>
