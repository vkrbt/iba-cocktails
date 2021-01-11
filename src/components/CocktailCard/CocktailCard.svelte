<script>
    import LowballIcon from 'components/CocktailCard/icons/lowball.svg';
    import HighIcon from 'components/CocktailCard/icons/highball.svg';
    import CocktailIcon from 'components/CocktailCard/icons/cocktail.svg';
    import IrishIcon from 'components/CocktailCard/icons/irish.svg';
    import ShotIcon from 'components/CocktailCard/icons/shot.svg';
    import WineIcon from 'components/CocktailCard/icons/wine.svg';
    import SparklingIcon from 'components/CocktailCard/icons/sparkling.svg';

    const ICONS = {
        'lowball glass': LowballIcon,
        'highball glass': HighIcon,
        'champagne flute': SparklingIcon,
        'cocktail glass': CocktailIcon,
        'wine glass': WineIcon,
        'irish coffee glass': IrishIcon,
        'shot glass': ShotIcon,
    }

    export let cocktail;
</script>

<div class="cocktail">
    <h3>
        {cocktail.en}
    </h3>
    <div class="card">
        <div class="icon">
            {@html ICONS[cocktail.dish]}
        </div>
        <!--            <div>-->
        <!--                <i>{item.drinkTime}</i>-->
        <!--                <a href={item.ibaLink}>IBA Link</a>-->
        <!--                <a href={item.link}>probarman.ru</a>-->
        <!--            </div>-->
        <ul>
            {#each cocktail.ingredients as ingredient}
                <li>
                    <span class="ingredient">
                        {ingredient.name}
                    </span>
                    {#if ingredient.amount}
                        <span class="amount">
                            {ingredient.amount}
                        </span>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
    <span class="method">{cocktail.method}</span>
</div>

<style>
    h3 {
        font-size: 32px;
        margin-bottom: 8px;
        font-family: 'Bevan', serif;
        font-weight: 400;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    li {
        list-style: none;
    }

    .icon {
        flex-basis: 50%;
        min-width: 50%;
        color: red;
    }

    .icon :global(path) {
        fill: #fff;
    }

    .icon :global(.water) {
        fill: currentColor;
    }

    .card {
        display: flex;
        align-items: center;
    }

    .method {
        opacity: 0.7;
        letter-spacing: 2px;
        font-style: italic;
    }

    .ingredient {
        display: flex;
        flex-direction: column;
    }

    .amount {
        font-style: italic;
        opacity: 0.5;
    }

    .cocktail {
        color: #fff;
        display: flex;
        flex-direction: column;
        padding: 16px;
    }

    @media screen and (max-width: 576px) {
        .cocktail {
            padding: 0 16px;
            justify-content: center;
        }
    }
</style>
