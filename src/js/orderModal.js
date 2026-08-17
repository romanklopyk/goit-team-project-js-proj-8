import iziToast from 'izitoast';
import { MakeOrder } from './api.js';
import 'izitoast/dist/css/iziToast.min.css';

function initOrderModal() {
  const button = document.getElementById('openOrderModal');
  const modalBackdrop = document.querySelector('.OrderModalBackdrop');
  const modal = document.querySelector('.OrderModal');
  const closeBtn = document.querySelector('.OrderModalClose');
  const form = document.querySelector('.OrderModalForm');
  const productIdInput = document.getElementById('orderProductId');

  if (!modalBackdrop || !modal) {
    return;
  }

  function openModal(productId = '') {
    if (productIdInput) {
      productIdInput.value = productId || '';
    }
    modalBackdrop.style.display = 'flex';
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modalBackdrop.style.display = 'none';
    document.body.classList.remove('no-scroll');
  }

  if (button) {
    button.addEventListener('click', openModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const comment = (formData.get('comment') || '').toString().trim();
      const productId = (formData.get('productId') || '').toString().trim();

      if (!form.reportValidity()) {
        return;
      }

      try {
        await MakeOrder({ name, phone, comment, productId });
        iziToast.success({
          title: 'Готово',
          message: 'Ваше замовлення успішно надіслано!',
          position: 'topRight',
          timeout: 4000,
        });
        form.reset();
        closeModal();
      } catch (error) {
        iziToast.error({
          title: 'Помилка',
          message: 'Не вдалося надіслати замовлення. Спробуйте ще раз.',
          position: 'topRight',
          timeout: 4000,
        });
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalBackdrop.style.display !== 'none') {
      closeModal();
    }
  });

  window.openOrderModal = openModal;
  window.closeOrderModal = closeModal;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrderModal);
} else {
  initOrderModal();
}

window.openOrderModalDirect = function openOrderModalDirect() {
  const modalBackdrop = document.querySelector('.OrderModalBackdrop');
  if (!modalBackdrop) return;
  modalBackdrop.style.display = 'flex';
  document.body.classList.add('no-scroll');
};