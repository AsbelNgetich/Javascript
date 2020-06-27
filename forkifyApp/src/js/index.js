import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controlSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();
    //const   query = 'pasta';
    console.log(query);

    if (query) {
        state.search = new Search(query);

        //prepare UI for results

        //search for recipes
        await state.search.getResults();

        //render results on UI
        console.log(state.search.result);

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


