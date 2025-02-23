import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery, smoothScroll } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Посилання на елементи
const refs = {
  formElem: document.querySelector('#search-form'),
  galleryElem: document.querySelector('.gallery'),
  btnLoadMore: document.createElement('button'),
  loaderElem: document.querySelector('.loader'),
};

// Налаштування кнопки "Load more"
refs.btnLoadMore.textContent = 'Load more';
refs.btnLoadMore.classList.add('load-more');
refs.btnLoadMore.style.display = 'none'; // спочатку прихована
refs.galleryElem.after(refs.btnLoadMore);

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
  refs.btnLoadMore.style.display = 'none';
  showLoader();

  try {
    const data = await fetchImages(params.query, params.page, params.perPage);
    params.totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'No results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      renderImages(data.hits);
      // Показуємо кнопку Load more, якщо є ще сторінки
      if (params.totalHits > params.perPage) {
        refs.btnLoadMore.style.display = 'block';
      }
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
  }

  // Очистка поля форми (опціонально)
  queryInput.value = '';
});

// Обробка кліку на кнопку "Load more"
refs.btnLoadMore.addEventListener('click', async () => {
  params.page += 1;
  showLoader();
  try {
    const data = await fetchImages(params.query, params.page, params.perPage);
    renderImages(data.hits, true);
    smoothScroll();

    // Розрахунок максимальної кількості сторінок
    const maxPage = Math.ceil(params.totalHits / params.perPage);
    if (params.page >= maxPage) {
      refs.btnLoadMore.style.display = 'none';
      iziToast.info({ title: 'Notice', message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later.' });
  } finally {
    hideLoader();
  }
});

// Функції для роботи з індикатором завантаження
function showLoader() {
  refs.loaderElem.style.display = 'block';
}

function hideLoader() {
  refs.loaderElem.style.display = 'none';
}