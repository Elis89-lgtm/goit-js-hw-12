import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery, smoothScroll } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Посилання на елементи
const refs = {
    formElem: document.querySelector('#search-form'),
    galleryElem: document.querySelector('.gallery'),
    targetElem: document.querySelector('.js-target'),
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

  // Скидаємо значення для нового запиту
  params.query = query;
  params.page = 1;

  clearGallery();
 
  showLoader();

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
      updateObserver();
    }
      
    
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
  }

  // Очистка поля форми 
  queryInput.value = '';
});

async function loadMore() {
    params.page += 1;
    showLoader();


  try {
    const data = await fetchImages(params.query, params.page, params.perPage);
    renderImages(data.hits, true);
    smoothScroll();
    updateObserver();
     
} catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong.' });
} finally {
    hideLoader();
}
}

const observer = new IntersectionObserver(entries => {
if (entries[0].isIntersecting) {
    loadMore();
}
}, { rootMargin: '100px' });

function updateObserver() {
if (params.page * params.perPage < params.totalHits) {
    observer.observe(refs.targetElem);
} else {
    observer.unobserve(refs.targetElem);
    iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
}
}

function showLoader() {
refs.loaderElem.style.display = 'block';
}

function hideLoader() {
refs.loaderElem.style.display = 'none';
}
