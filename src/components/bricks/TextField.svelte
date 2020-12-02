<script>

export let placeholder;
export let id;
export let input;
export let value;

</script>

<style>
.container {
  display: inline-block;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  padding: 16px 20px;
  border: 1px solid #b7b7b7;
  -webkit-border-radius: 8px;
  border-radius: 8px;
  font: normal 24px/normal "Comfortaa", cursive, sans-serif;
  color: #5A352A;
  -o-text-overflow: clip;
  text-overflow: clip;
  background: #DDA455;
  -webkit-box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) inset;
  box-shadow: 2px 2px 2px 0 rgba(0,0,0,0.2) inset;
  text-shadow: 1px 1px 0 rgba(132,99,99,0.66) ;
  -webkit-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
  -moz-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
  -o-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
  transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1);
  outline: 0;
}
</style>

<!--
<input
  bind:this={nameInput} bind:value={name} 
/>
-->

<input id="{id}" class={`container ${$$props.class}`} type="text" placeholder="{placeholder}" bind:this={input} bind:value={value}>
