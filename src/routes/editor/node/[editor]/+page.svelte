<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import CodeMirror from "svelte-codemirror-editor";
  import { python } from "@codemirror/lang-python";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { runInNewContext } from 'vm';

  let code = `let x = 10;
    console.log(x);`;

  let output = '';

  // Create a writable store for the output
  const outputStore = writable('');

  async function executeCode() {
    outputStore.set('');

    try {
      const sandbox = { console: console };
      runInNewContext(code, sandbox);
      output = sandbox.console.output.join('\n');
    } catch (error) {
      output = error.message;
    }

    // Update the output store
    outputStore.set(output);
  }

  let console = {
    output: [],
    log: function (message) {
      this.output.push(message);
    }
  };
</script>

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
      <p>Output:</p>
      <pre>{$outputStore}</pre>
    </div>
  </div>
</div>

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
