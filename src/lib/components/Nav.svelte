<script>
	import { page } from '$app/stores';
	import IconSignIn from '$lib/icons/IconSignIn.svelte';
	import IconSignOut from '$lib/icons/IconSignOut.svelte';
	import { signIn, signOut } from '@auth/sveltekit/client';
</script>

<nav>
	<div>
		<a href="/" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-coffee"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
			<h1>Chip</h1>
		</a>
	</div>

	<div style="margin-left: auto;">
		{#if $page.data.session}
			<div class="user-chip">
				<img
					height="32"
					width="32"
					src={$page.data.session.user?.image}
					alt={`${$page.data.session.user?.name}'s profile`}
				/>
				<span>{$page.data.session.user?.name}</span>

				<button on:click={() => signOut()} class="clear">
					<IconSignOut />
				</button>
			</div>
		{:else}
			<button on:click={() => signIn()} class="clear">
				<IconSignIn />
				Sign in
			</button>
		{/if}
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		padding: 16px 20% 16px 20%;
		background: #fff;
		position: sticky;
		top: 0;
		left: 0;
		width: 100%;
		box-shadow: #ccc 0 2px 10px;
	}

	.user-chip {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		height: 32px;
	}

	a {
		text-decoration: none;
		color: #000;
	}

	.clear {
		background: transparent;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		gap: 4px;
	}

	button {
		cursor: pointer;
	}
</style>
