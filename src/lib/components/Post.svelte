<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import IconCheck from '$lib/icons/IconCheck.svelte';
	import IconUpArrow from '$lib/icons/IconUpArrow.svelte';
	import IconRadio from '$lib/icons/IconRadio.svelte';

	export let question: Record<string, string>;
</script>

<div class="entry">
	<div class="votes">
		<form
			action="?/vote"
			method="post"
			use:enhance={({ formElement, formData, action, cancel }) => {
				return async ({ result }) => {
					await invalidateAll();
				};
			}}
		>
			<input type="hidden" name="question_id" value={question.id} />
			<button type="submit" class="upvote-button">
				<IconUpArrow />
			</button>
		</form>
		{question.upvotes.length}


        {#if question.selected_answer_id}
            <IconCheck />
        {:else}
            <IconRadio />
        {/if}
	</div>

	<a href={`/q/${question.id}`}>
		<div>
			<h2>{question.title}</h2>

			<span>
				Asked by
				<img
					height="16"
					width="16"
					src={question.creator_image}
					alt={`${question.creator_name}'s image'`}
				/>
				{question.creator_name}
				&bull;
				{new Date(question.creation_timestamp).toLocaleString()}
			</span>

			<p>{question.description.substring(0, Math.min(100, question.description.length))}...</p>
		</div>
	</a>
</div>

<style>
	a {
		color: #000;
		text-decoration: none;
	}

	img {
		display: inline;
	}

	span {
		vertical-align: middle;
	}

	.entry {
		display: grid;
		align-items: flex-start;
		grid-template-columns: 32px 1fr;
		gap: 1rem;

		padding-top: 1rem;
		padding-bottom: 1rem;
		margin-bottom: 1rem;

		border-bottom: 1px #ddd solid;
	}

	.votes {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
		justify-content: center;
	}

	.upvote-button {
		background: transparent;
		border: none;
        cursor: pointer;
	}
</style>
