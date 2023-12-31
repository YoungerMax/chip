<script>
	import { page } from '$app/stores';
	import Post from '$lib/components/Post.svelte';
</script>

<div class="header">
	<h1>Questions</h1>

	<div style="margin-left: auto;">
		<a href="/ask">Ask a question</a>
	</div>
</div>

{#each $page.data.questions as question}
	<Post {question} />
{:else}
	<p>There aren't any questions yet. Be the first to <a href="/ask">ask one!</a></p>
{/each}

<style>
	.header {
		display: flex;
		align-items: center;
	}
</style>
