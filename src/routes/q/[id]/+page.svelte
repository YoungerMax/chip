<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import IconCheck from '$lib/icons/IconCheck.svelte';
	import IconUpArrow from '$lib/icons/IconUpArrow.svelte';
	import '../../../form.css';

	let accountAddress: string | null = null;
	const hasMetamask = 'ethereum' in window;

	async function getAccount(): Promise<string> {
		if (!hasMetamask) {
			return '0x';
		}

		const accounts = await window.ethereum
			.request({ method: 'eth_requestAccounts' })
			.catch((err) => {
				if (err.code === 4001) {
					// EIP-1193 userRejectedRequest error
					// If this happens, the user rejected the connection request.
					console.log('Please connect to MetaMask.');
				} else {
					console.error(err);
				}
			});

		return accounts[0];
	}

	async function chip() {
		await window.ethereum.request({
			method: 'eth_sendTransaction',
			// The following sends an EIP-1559 transaction. Legacy transactions are also supported.
			params: [
				{
					from: accountAddress, // The user's active address.
					to: $page.data.question.chip_recipient_address.substring(2), // Required except during contract publications.
					value: (
						parseFloat(
							prompt('Enter the amount of ' + $page.data.chipped.symbol + ' to chip in') || '0'
						) * Math.pow(10, $page.data.chipped.decimals)
					).toString(16)
				}
			]
		});
	}

	onMount(async () => {
		accountAddress = await getAccount();
	});
</script>

<title>{$page.data.question.title} | Chip</title>

<section class="entry">
	<div class="post" style="border-bottom: none;">
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
				<input type="hidden" name="question_id" value={$page.data.question.id} />
				<button type="submit" class="upvote-button">
					<IconUpArrow />
				</button>
			</form>
			<span>{$page.data.question.upvotes.length}</span>
		</div>

		<div>
			<h2>{$page.data.question.title}</h2>

			{$page.data.question.description}

			<div class="user-chip" style="margin-top: 2rem;">
				Asked by
				<img
					height="24"
					width="24"
					src={$page.data.question.creator_image}
					alt={`${$page.data.question.creator_name}'s name`}
				/>
				{$page.data.question.creator_name}
				&bull;
				{new Date($page.data.question.creation_timestamp).toLocaleString()}
			</div>
		</div>
	</div>
</section>

<section>
	<h2>Chip in</h2>

	{#if $page.data.question.selected_answer_id}
		<p>This question has been answered already, so chipping in for this question is over.</p>
	{:else}
		<p>{$page.data.chipped.amount} {$page.data.chipped.symbol} chipped in already</p>
		<br />
		<span>
			<button on:click={chip} class="clear">Chip in with Metamask</button>
			or send to
			<strong>{$page.data.question.chip_recipient_address}</strong>
		</span>
	{/if}
</section>

<section>
	<h2>Answers</h2>

	{#each $page.data.answers as answer}
		<div class="post">
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
					<input type="hidden" name="answer_id" value={answer.id} />
					<button type="submit" class="upvote-button">
						<IconUpArrow />
					</button>
				</form>

				<span title="Upvote count">{answer.upvotes.length}</span>

				{#if answer.id === $page.data.question.selected_answer_id}
					<IconCheck />
				{/if}
			</div>

			<div>
				<div>
					{answer.description}
				</div>

				<div class="user-chip" style="margin-top: 2rem;">
					{#if $page.data.session?.user?.name === $page.data.question.creator_name && $page.data.question.selected_answer_id === null}
						<form action="?/answered" method="post">
							<input type="hidden" name="answer_id" value={answer.id} />
							<button type="submit" class="clear"> Permanently mark as answer </button>
						</form>
						&bull;
					{/if}
					Answered by
					<img
						height="24"
						width="24"
						src={answer.creator_image}
						alt={`${answer.creator_name}'s name`}
					/>
					{answer.creator_name}
					&bull;
					{new Date(answer.creation_timestamp).toLocaleString()}
				</div>
			</div>
		</div>
	{:else}
		<p>There aren't any answers yet. You can be the first!</p>
	{/each}

	<h3 style="margin-top: 1rem;">Add your answer</h3>

	{#if $page.data.question.selected_answer_id}
		<p>
			This post has been answered already, so you won't be eligible to recieve the chip bounty
			because it's already been collected.
		</p>
	{/if}

	{#if $page.data.session}
		<form method="post" action="?/answer">
			<textarea
				placeholder="Describe your answer here..."
				id="description"
				name="description"
				required
				rows="20"
			></textarea>

			<label for="address">Your address</label>
			<input type="text" id="address" name="address" required bind:value={accountAddress} />

			<input type="submit" value="Submit" />
		</form>
	{:else}
		<p>You have to sign in to submit an answer.</p>
	{/if}
</section>

<style>
	img {
		display: inline;
	}

	span {
		vertical-align: middle;
	}

	section {
		padding-top: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px #aaa solid;
	}

	.votes {
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
		justify-content: center;
	}

	.post {
		display: grid;
		align-items: flex-start;
		grid-template-columns: 32px 1fr;
		gap: 1rem;

		padding-top: 1rem;
		padding-bottom: 1rem;

		border-bottom: 1px #ddd solid;
	}

	.upvote-button {
		background: transparent;
		border: none;
	}

	.user-chip {
		display: flex;
		align-items: center;
		gap: 4px;
		color: #777;
	}

	.clear {
		text-decoration: underline;
		color: #111;
		border-radius: 4px;
		background: none;
		font-size: 16px;
		cursor: pointer;
		border: none;
	}

	[type='submit'] {
		cursor: pointer;
	}
</style>
