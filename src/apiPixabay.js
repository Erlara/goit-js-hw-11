import axios from 'axios';
const API_KEY = `23580980-4f75151f85975025bb6074227`;
const BASE_URL = `https://pixabay.com/api/`;

export default class NewApiService{
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    async fetchImages() {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
        return await response.data;
     }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
    
