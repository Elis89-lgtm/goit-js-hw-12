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
      } else {
        gallery.innerHTML = markup;
      }
    
    
}

export function clearGallery() {
    gallery.innerHTML = '';
}

export function smoothScroll() {
    // Отримуємо висоту першої картки галереї
    const firstCard = gallery.firstElementChild;
    if (firstCard) {
      const { height } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }
  }