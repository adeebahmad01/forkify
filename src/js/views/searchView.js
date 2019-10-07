import { elements } from "./base";
export const getInput = () => elements.searchInput.value;
export const clearInput = ()=> {
  elements.searchInput.value =''
}
export const clearResult = ()=> {
  elements.searchResList.innerHTML=''
  elements.searchResPages.innerHTML=''
}
const limitRecipeTitle = (title, limit=17)=>{
  if(title.length> limit){
    const newTitle = []
    title.split(' ').reduce((acc, cur) =>{
      if(acc + cur.length  <= limit){
        newTitle.push(cur)
      }
      return acc + cur.length 
    },0);
    //return Result

return `${newTitle.join(' ')} ...`
  } 
  return title
}
const renderRecipe = recipe => {
  let makrup
  if(recipe != undefined ){
    makrup = `
    <li title="${recipe.title}">
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>`
  }
  else{
    makrup = `<h1 style="color:red; font-size: 5rem; font-family: inherit">Limits Of API requests per day Has Reached</h1>`
  }
  elements.searchResList.insertAdjacentHTML('beforeend', makrup)
};
const createButton =(pages,type)=> `
  <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? pages -1 : pages+1}">
    <span>Page ${type === 'prev' ? pages -1 : pages+1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
  </button>
`;
const renderButton = (page,numResult,resPerPage)=>{
  const pages = Math.ceil(numResult/resPerPage);
  let button
  if( page === 1 && pages > 1){
    //Button only  to prev Page 2
    button =createButton(page, 'next')
  }
  else if(page< pages){
    //Both Button
    button = `
    ${createButton(page , "prev")}
    ${createButton(page , "next")}
    `
  }
  else if( page === pages && pages > 1){
    //Button only to next Page 2
    button = createButton(page, 'prev')
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};
export const renderResult = (recipes,page=1, resPerPage =10) => {
  //Render Result of current page
  const start = (page -1) * resPerPage;
  const end = page* resPerPage

  recipes.slice(start,end).forEach(renderRecipe);
  //Render Button
  renderButton(page,recipes.length, resPerPage)
}
