import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox;


export function renderImages(images, isAppend = false) {
    const markup = images
    .map(image => `
        <a href="${image.largeImageURL}" class="gallery-item">
            <img src="${image.webformatURL}" alt="${image.tags}" />
            <div class="image-info">
                <p><strong>Likes:</strong> ${image.likes}</p>
                <p><strong>Views:</strong> ${image.views}</p>
                <p><strong>Comments:</strong> ${image.comments}</p>
                <p><strong>Downloads:</strong> ${image.downloads}</p>
            </div>
        </a>
        
    `).join('');

    if (isAppend) {
        gallery.insertAdjacentHTML('beforeend', markup);
        smoothScroll();
      } else {
        gallery.innerHTML = markup;
      }
    
    
}

export function clearGallery() {
    gallery.innerHTML = '';
}

export function smoothScroll() {
  const cards = document.querySelectorAll('.gallery-item'); // Отримуємо всі картки
  if (cards.length > 0) {
      const cardHeight = cards[0].getBoundingClientRect().height; // Висота однієї картки
      const perPage = 40; 
      const pagesToScroll = 2; // Кількість сторінок для прокрутки

      window.scrollBy({
          top: cardHeight * perPage * pagesToScroll, // Прокрутка на 2 сторінки
          behavior: 'smooth',
      });
  }
}
