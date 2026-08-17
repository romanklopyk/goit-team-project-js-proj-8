import { Spinner } from 'spin.js';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import 'css-star-rating/css/star-rating.css';
import getData from './api.js';
import Swal from 'sweetalert2';

async function createDetailWindow(id) {
    const spinner = new Spinner({
        lines: 12,
        length: 6,
        width: 4,
        radius: 8,
        color: '#e39622',
    });

    const $dessertDetails = basicLightbox.create(`
        <div class="dessert-loader" style="position: relative; min-height: 200px;"></div>
    `, {
        closable: false,
        className: 'dessert-modal-wrapper',
        onClose: () => {
            document.body.classList.remove('no-scroll');
        },
    });
    document.body.classList.add('no-scroll');
    $dessertDetails.show();


    const loaderEl = $dessertDetails.element().querySelector('.dessert-loader');
    spinner.spin(loaderEl);

    try {
        const {
            name,
            description,
            composition,
            price,
            rate,
            image,
        } = await getData(`/desserts/${id}`, { method: 'GET' });
        $dessertDetails.element().innerHTML = `
            <div class="dessert-modal">
                    <button class="close-modal-btn"  aria-label="Закрити">
                        <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                             <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <div>
                        <img class="dessert-modal-img" src="${image}" alt="${name}" width="300" />                    
                    </div>
                    <div>
                        <h3 class="dessert-modal-name">${name}</h3>
                        <p class="dessert-modal-price">${price} грн</p>
                        <div class="dessert-modal-rating">${createStars(rate)}</div>
                        <p class="dessert-modal-description">${description}</p>
                        <p class="dessert-modal-composition"><span>Склад</span>: ${composition}</p>
                        <button class="dessert-modal-order-btn">Перейти до замовлення</button>                    
                    </div>                            
            </div>`;

        const $closeBtn = $dessertDetails.element().querySelector('.close-modal-btn');
        const $orderBtn = $dessertDetails.element().querySelector('.dessert-modal-order-btn');

        $closeBtn.addEventListener('click', () => {
            $dessertDetails.close();
        });

        $orderBtn.addEventListener('click', () => {
            $dessertDetails.close();

            const modalBackdrop = document.querySelector('.OrderModalBackdrop');
            if (modalBackdrop) {
                modalBackdrop.style.display = 'flex';
                document.body.classList.add('no-scroll');

                const productIdInput = document.getElementById('orderProductId');
                if (productIdInput) {
                    productIdInput.value = id;
                }
                return;
            }

            if (typeof window.openOrderModal === 'function') {
                window.openOrderModal(id);
                return;
            }

            if (typeof window.openOrderModalDirect === 'function') {
                window.openOrderModalDirect(id);
            }
        });

        const $modalWrapper = document.querySelector('.dessert-modal-wrapper');
        $modalWrapper.addEventListener('click', e => {
            if (e.target === $modalWrapper) {
                $dessertDetails.close();
            }
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                $dessertDetails.close();
            }
        })

    } catch (error) {
        Swal.fire({
            icon: "error",

        });
        $dessertDetails.close();
    } finally {
        spinner.stop();
    }
}

function createStars(value) {
    const stars = Array.from({ length: 5 }, () => `
    <div class="star">
      <svg class="star-empty" viewBox="0 0 34 32" aria-hidden="true">
        <path d="M33.412 12.395l-11.842-1.021-4.628-10.904-4.628 10.92-11.842 1.005 8.993 7.791-2.701 11.579 10.179-6.144 10.179 6.144-2.685-11.579 8.976-7.791zM16.941 22.541l-6.193 3.739 1.647-7.049-5.468-4.744 7.214-.626 2.8-6.638 2.816 6.654 7.214.626-5.468 4.744 1.647 7.049-6.209-3.755z" />
      </svg>
      <svg class="star-half" viewBox="0 0 34 32" aria-hidden="true">
        <path d="M33.412 12.395 21.57 11.374 16.942.47 12.314 11.39.472 12.395l8.993 7.791-2.701 11.579 10.179-6.144 10.179 6.144-2.685-11.579 8.976-7.791ZM16.941 22.541c0 0-.298-14.646 0-15.318l2.816 6.654 7.214.626-5.468 4.744 1.647 7.049Z" />
      </svg>
      <svg class="star-filled" viewBox="0 0 34 32" aria-hidden="true">
        <path d="M16.941 25.621 27.12 31.765l-2.701-11.579 8.993-7.791-11.842-1.005L16.942.47l-4.628 10.92L.472 12.395l8.993 7.791-2.701 11.579Z" />
      </svg>
    </div>
  `).join('');

    function getRatingClass(rate) {
        const roundedRate = Math.round(Number(rate) * 2) / 2;
        const integerPart = Math.floor(roundedRate);
        const hasHalf = roundedRate % 1 !== 0;
        return hasHalf ? `value-${integerPart} half` : `value-${integerPart}`;
    }

    const ratingClass = getRatingClass(value);
    return `
    <div class="rating ${ratingClass} color-default ">
      <div class="star-container">
        ${stars}
      </div>
    </div>
  `;
}

export default createDetailWindow;
