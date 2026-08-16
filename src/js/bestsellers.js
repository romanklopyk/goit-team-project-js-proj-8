import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import iziToast from 'izitoast';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'izitoast/dist/css/iziToast.min.css';

const API_URL = 'https://deserts-store.b.goit.study/api/desserts?page=1&limit=10&type=popular';

const popularListEl = document.getElementById('popular-list');
const loaderEl = document.getElementById('popular-loader');

let swiperInstance = null;

/* ---------- Хелпери ---------- */

function showToastError(message) {
    iziToast.error({
        message,
        position: 'topRight',
        timeout: 4000,
        progressBar: false,
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

function toggleLoader(isLoading) {
    loaderEl?.classList.toggle('hidden', !isLoading);
}

function extractItems(data) {
    return data?.desserts ?? [];
}

/* ---------- Основна логіка ---------- */

async function fetchPopularProducts() {
    if (!popularListEl) return;

    toggleLoader(true);
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        const data = await response.json();
        const items = extractItems(data);

        if (!items.length) {
            showToastError('Популярні товари поки що відсутні.');
            return;
        }

        renderCards(items);
        initSwiper();
    } catch (error) {
        console.error('Bestsellers fetch error:', error);
        showToastError('Не вдалося завантажити популярні товари. Спробуйте пізніше.');
    } finally {
        toggleLoader(false);
    }
}

function renderCards(products) {
    const markup = products
        .map(item => {
            const { name, category, description, price, image } = item;
            const safeName = escapeHtml(name ?? '');
            const categoryName = category?.name ?? 'Десерти';

            return `
                <div class="swiper-slide">
                    <article class="product-card">
                        <img
                            class="product-img"
                            src="${image ?? ''}"
                            alt="${safeName}"
                            loading="lazy"
                        />
                        <div class="product-info">
                            <p class="product-category">${escapeHtml(categoryName)}</p>
                            <h3 class="product-title">${safeName}</h3>
                            <p class="product-description">${escapeHtml(description ?? '')}</p>
                            <div class="product-footer">
                                <span class="product-price">${price ?? 0} грн</span>
                                <button class="btn-details" type="button" aria-label="Детальніше про ${safeName}">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        })
        .join('');

    popularListEl.innerHTML = markup;
}

function initSwiper() {
    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    }

    swiperInstance = new Swiper('.popular-swiper', {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 16,

        pagination: {
            el: '#popular-pagination',
            dynamicBullets: true,
            clickable: true,
        },

        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },

        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 16,
            },
            1440: {
                slidesPerView: 3,
                spaceBetween: 32,
            },
        },
    });
}

document.addEventListener('DOMContentLoaded', fetchPopularProducts);