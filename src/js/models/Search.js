import axios from "axios";
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResult() {
      
      try {
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
        this.result = res.data.recipes;
        if(res.data === undefined){
          alert('Error')
        }
      } catch (error) {
        alert("ERROR !!!!!");
        console.log(error);
      }
    }
  }
  
