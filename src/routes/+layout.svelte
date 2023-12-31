<script>
	import Nav from '$lib/components/Nav.svelte';
	import '../app.css';
</script>

<Nav />

<title>Where Questions Meet Rewards | Chip</title>


<main>
	<div style="margin: 10px;"></div>
	<slot />
</main>

<style>
	main {
		width: 35%;
		margin: auto;
	}
</style>
