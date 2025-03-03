import { fetchImages } from './js/pixabay-api.js'; 
import { renderImages, clearGallery, smoothScroll } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const lightbox = new SimpleLightbox('.gallery a');

// Посилання на елементи
const refs = {
    formElem: document.querySelector('#search-form'),
    galleryElem: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    loaderElem: document.querySelector('.loader'),
};



// Параметри запиту
const params = {
  query: '',
  page: 1,
  perPage: 40,
  totalHits: 0,
};

// Обробка сабміту форми
refs.formElem.addEventListener('submit', async e => {
  e.preventDefault();

  const queryInput = e.target.elements.searchQuery;
  const query = queryInput.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search term!' });
    return;
  }

  params.query = query;
  params.page = 1;

  clearGallery();
  showLoader();
  refs.loadMoreBtn.style.display = 'none';

  try {
    const data = await fetchImages(params.query, params.page, params.perPage);
    params.totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message: 'No images found. Try again!',
      });
    } else {
      renderImages(data.hits);
      lightbox.refresh();
      if (params.page * params.perPage < params.totalHits) {
        refs.loadMoreBtn.style.display = 'block';
      }
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
  }

  queryInput.value = '';
});

refs.loadMoreBtn.addEventListener('click', async () => {
  params.page += 1;
  showLoader();

  try {
    const data = await fetchImages(params.query, params.page, params.perPage);
    renderImages(data.hits,true);
    lightbox.refresh();
    smoothScroll();

    if (params.page * params.perPage >= params.totalHits) {
      refs.loadMoreBtn.style.display = 'none';
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
  } finally {
    hideLoader();
  }
});


function showLoader() {
  refs.loaderElem.style.display = 'block';
}

function hideLoader() {
  refs.loaderElem.style.display = 'none';
}
