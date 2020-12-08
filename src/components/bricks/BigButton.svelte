<script>

export let selected;
export let disabled;

</script>

<style>

.myButton {
	box-shadow: 0px 1px 0px 0px #1c1b18;
	background:linear-gradient(to bottom, #065143 5%, #04392f 100%);
	background-color:#065143;
	border-radius:15px;
	border:2px solid #333029;
	display:inline-block;
	cursor:pointer;
	color:#bdf7b7;
	font-family:Comfortaa;
	font-size:14px;
	padding:12px 16px;
	text-decoration:none;
	text-shadow:0px 1px 6px #ffffff;
}
.myButton:hover {
	background:linear-gradient(to bottom, #04392f 5%, #065143 100%);
	background-color:#04392f;
}
.myButton:active {
	position:relative;
	top:1px;
}

.myButton.selected {
	background:linear-gradient(to bottom, #bdf7b7 5%, #abf5a3 100%);
	background-color:#bdf7b7;
	border-radius:15px;
	border:2px solid #333029;
	display:inline-block;
	cursor:pointer;
	color:#065143;
}

.myButton.disabled {
	background:linear-gradient(to bottom, #C0BCC7 5%, #aba6b5 100%);
	background-color:#C0BCC7;
	border-radius:15px;
	border:2px solid #333029;
	display:inline-block;
	cursor:pointer;
	color:#065143;
}
</style>

<button {disabled} type="submit" class={`myButton ${$$props.class || ''}`} class:disabled class:selected on:click><slot></slot></button>
