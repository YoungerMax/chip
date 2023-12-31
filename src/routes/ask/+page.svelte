<script>
	import '../../form.css';
	import { page } from '$app/stores';
</script>

<title>Ask a question | Chip</title>

{#if $page.data.session}
	<h1>Ask a question</h1>

	<form method="post">
		<label for="title">Title</label>
		<input type="text" id="title" name="title" class="input" required />

		<label for="description">Description</label>
		<textarea id="description" name="description" class="input" required rows="20"></textarea>

		<input type="submit" value="Submit" class="button" />
	</form>
{:else}
	<h1>Authentication required</h1>
	<p>You need to sign in to be able to ask a question.</p>
{/if}

<style>
	h1 {
		margin-bottom: 10px;
	}
</style>
