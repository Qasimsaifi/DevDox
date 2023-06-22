<script>
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';

  export let code = '';
  export let language = 'javascript';
  export let value;

  const editorStore = writable(null);
  let editorContainer;

  onMount(() => {
    require.config({ paths: { 'vs': '/path/to/monaco-editor/min/vs' } });

    require(['vs/editor/editor.main'], () => {
      const editor = monaco.editor.create(editorContainer, {
        value: code,
        language,
        theme: 'vs-dark', // Apply the dark theme
      });

      editor.onDidChangeModelContent(() => {
        value = editor.getValue();
      });

      editorStore.set(editor);
    });
  });

  afterUpdate(() => {
    const editor = editorStore.get();
    if (editor && value !== editor.getValue()) {
      editor.setValue(value);
    }
  });
</script>

<style>
  .editor-container {
    height: 300px;
  }
</style>

<div class="editor-container" bind:this={editorContainer}>
</div>
