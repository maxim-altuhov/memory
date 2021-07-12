import './index.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

function initFunction() {

  function initControl(selector, numberOfCards) {
    const controls = $(selector);

    controls.on('click', function() {
      if (!$(this).hasClass('control__btn_active')) {
        controls.removeClass('control__btn_active');

        $(this).addClass('control__btn_active');

        if (selector === '.simplicity button') {
          numberOfCards = $(this).text();
          new Cards().remove();
          new Cards(numberOfCards).render();
        }
      }
    });

    if (numberOfCards) new Cards(numberOfCards).render();
  }

  // Класс для работы с карточками
  class Cards {
    constructor(quantity) {
      this.quantity = quantity;
    }

    render() {
      const fragment = document.createDocumentFragment();

      for (let index = 0; index < this.quantity; index++) {
        const element = document.createElement('div');
        $(element).addClass('card');
        $(element).html(`<div class="card__face card__face_front"></div><div class="card__face card__face_back">Text</div>`);

        $(element).on('click', () => {
          $(element).toggleClass('is-flipped');
        });

        fragment.append(element);
      }

      $('.memory__wrapper').append(fragment);
    }

    remove() {
      $('.card').remove();
    }
  }

  // вызов функций и методов
  initControl('.simplicity button', 8);
  initControl('.type button');
}

$(() => {
  initFunction();
});
