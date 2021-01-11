<script>
	import cocktails from 'cocktails.json';
	import CocktailCard from 'components/CocktailCard/CocktailCard.svelte';
</script>

<div class="list">
	{#each cocktails.list as item}
		<div class="item">
			<CocktailCard cocktail={item} />
		</div>
	{/each}
</div>

<svelte:head>
	<title>Vlad Korbut | IBA Cocktails</title>
	<meta property="description" content="" />
	<meta property="og:title" content="Vlad Korbut | IBA Cocktails" />
	<meta property="og:type" content="website" />
</svelte:head>

<style>
	.list {
		padding: 16px 0;
		max-width: 1600px;
		margin: auto;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	@media screen and (max-width: 576px) {
		.item + .item {
			margin-top: 48px;
		}
	}

	@media screen and (max-width: 720px) {
		.list {
			display: flex;
			flex-direction: column;
		}
	}

	@media screen and (max-width: 1200px) {
		.list {
			grid-template-columns: 1fr 1fr;
		}
	}

</style>
