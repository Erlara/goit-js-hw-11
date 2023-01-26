import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewApiService from './apiPixabay';

const newApiService = new NewApiService();
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let per_page = 40;

searchForm.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onLoad);

loadBtn.style.display = 'none';

async function onSearch(evt) {
    evt.preventDefault();
    clearGallery();
    newApiService.query = evt.currentTarget.elements.searchQuery.value.trim();

    if (evt.currentTarget.elements.searchQuery.value.trim() === '') {
         return;
    }
    
    newApiService.resetPage();
    const images = await newApiService.fetchImages();
    
            if (images.hits.length === 0) {
                         Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');   
            }
            else {
                await renderCard(images);
                 simpleLightbox.refresh();
            Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`)
                   loadBtn.style.display = 'block';
            }
     }      

    
function renderCard(images) {
    const markup = createCard(images);
    gallery.insertAdjacentHTML('beforeend', markup)
}

function createCard(images) {
       return images.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<a href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div></a>`
        })
        .join('');
}

async function onLoad() {
    newApiService.incrementPage();
    const images = await newApiService.fetchImages()
       await renderCard(images);

const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
        simpleLightbox.refresh();
        const allPage = images.total / per_page;
       
    if (newApiService.page === Math.ceil(allPage)) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function clearGallery() {
    gallery.innerHTML = "";
    };

