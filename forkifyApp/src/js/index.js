import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/** Search Controller **/
const controlSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();
    
    if (query) {
        state.search = new Search(query);

        //prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //search for recipes
            await state.search.getResults();

            clearLoader();
            //render results on UI
            searchView.renderResults(state.search.result);
        } catch (err){
            alert('Something went wrong with search');
            clearLoader();

        }

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});

/** Recipe Controller **/

const controlRecipe = async () => {

    const id = window.location.hash.replace('#', '');
    console.log(id);
    
    if (id) {

        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected item
        if(state.search) searchView.highlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        //testing
      //  window.r = state.recipe;

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }catch(err){
            alert('Error processing recipe in index!');

        }
    }




};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

//recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } 
});