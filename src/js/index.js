import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
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
window.s = state;

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * SEARCH CONTROLLER * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

const controlSearch = async () => {
  // 1) Get query from the VIew
  const query = searchView.getInput(); //TODO
  if (query) {
    //2) New search object and add to state
    state.search = new Search(query);

    //3) Prepare UI for Result
    searchView.clearInput();
    searchView.clearResult();
    renderLoader(elements.searchRes);
    try {
      //4) Search for recpies
      await state.search.getResult();

      //5) Render Result on UI
      clearLoader();
      searchView.renderResult(state.search.result);
    } catch (err) {
      console.log(err);
      alert("Error Search");
      clearLoader();
    }
  }
};
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResult(state.search.result, gotoPage);
  }
});

/*
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! RECIPE CONTROLLER ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 */

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");
  if (id) {
    //Prepare UI FOR Changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //  Highlight Selected
    if (state.search) {
      searchView.selectedElement(id);
    }

    //Create new recipe Object
    state.recipe = new Recipe(id);
    window.r = state.recipe;
    try {
      //Get recipe Data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();
      //render Recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Some Thing Went Wrong :(");
    }
  }
};
["hashchange", "load"].forEach(e => window.addEventListener(e, controlRecipe));

/*
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?  LIST CONTROLLER  ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 */

const controlList = () => {
  if (!state.list) state.list = new List();
  //Display ON UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

/*
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? HANDLE DELETE AND UPDATE EVENTS ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
 */

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (e.target.matches(".shopping__delete , .shopping__delete *")) {
    //Delete from state
    state.list.deleteItem(id);
    //DELETE FROM UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


/*
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! LIKES CONTROLLER  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
 */
const controlLike = ()=>{
  if (!state.likes) state.likes = new Likes();
  const curID = state.recipe.id;
  
  if(!state.likes.isLiked(curID)){
  // Add like to data
  const newLike = state.likes.addLike(curID,state.recipe.title,state.recipe.author,state.recipe.img);
  // toggle button
  likesView.toggleLikeBtn(true);
  //Add like to UI
  likesView.renderLikes(newLike);
  } else{
    //Remove Like From state
    state.likes.deleteLike(curID);
    likesView.toggleLikeBtn(false);
    likesView.deleteLiked(curID)
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes())
}

//Restore Liked Recipe on Page LOad
window.addEventListener('load', ()=>{
  state.likes = new Likes();
  //Restore Likes
  state.likes.readStorage();
  //Toggle Button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //Render Existing
  state.likes.likes.forEach(el=> likesView.renderLikes(el))
})

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * *  HANDLING RECIPE BUTTON CLICK * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-dec, .btn-dec *")) {
    //Decrease BTN Clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingIng(state.recipe);
    }
  } else if (e.target.matches(".btn-inc, .btn-inc *")) {
    //Increase BTN Clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingIng(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //Add list BTN Clicked
    controlList();
  }else if (e.target.matches(".recipe__love, .recipe__love *")){
    //Like Controller
    controlLike();
  }
});



