import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements,renderLoader,clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
// 
/**
 * !!!!!!!!! Global STATE !!!!!!!!!
 * ????????? Global STATE ?????????
 * ? Search Object
 * ! Current Recipe Object
 * * Shopping List Object
 * todo { Liked Recipes }
 */
const state = {};

const controlSearch =async ()=>{
  // 1) Get query from the VIew
  const query = searchView.getInput() //TODO
  if(query){
    //2) New search object and add to state
    state.search = new Search(query);
    
    //3) Prepare UI for Result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);
    try{
      //4) Search for recpies
      await state.search.getResult();
    
      //5) Render Result on UI
      clearLoader()
      searchView.renderResult(state.search.result);
    } catch(err){
      console.log(err);
      alert('Error Search');
      clearLoader()
    }
  }
}
  elements.searchForm.addEventListener('submit', e =>{
  e.preventDefault()
  controlSearch()
});
elements.searchResPages.addEventListener('click', e=>{
  const btn = e.target.closest('.btn-inline')
  if(btn){
    const gotoPage = parseInt(btn.dataset.goto,10);
    searchView.clearResult();
    searchView.renderResult(state.search.result, gotoPage);
  }
})

const controlRecipe = async ()=>{
  const id = window.location.hash.replace('#', '');
  console.log(id)
  if(id){
    //Prepare UI FOR Changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)
    //Create new recipe Object
    //state.recipe = new Recipe(id)
    state.recipe = new Recipe(id)
    try{
      //Get recipe Data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();
      //render Recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log(error);
      alert('Some Thing Went Wrong :(');
    }
    
  }
}
['hashchange','load'].forEach(e => window.addEventListener(e, controlRecipe))