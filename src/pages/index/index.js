import './index.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

function initFunction() {
  let numberOfCards;

  // функ. для перемешивания случайным образом эл-тов массива
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // переключение и сравнение карточек
  function checkingCards() {
    function checkThisCard(classDisabled = '') {
      const $cards = $('.card');

      $cards.addClass('not-click');
      setTimeout(() => {
        $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
        $cards.removeClass('not-click');
      }, 800);
    }

    let flippedCard;

    if ($('.is-flipped').length < 2) {
      $(this).toggleClass('is-flipped');
      flippedCard = $('.is-flipped');
    }

    if (flippedCard.length === 2 && flippedCard.eq(0).text() !== flippedCard.eq(1).text()) {
      checkThisCard();
    } else if (flippedCard.length === 2 && flippedCard.eq(0).text() === flippedCard.eq(1).text()) {
      checkThisCard('disabled');
    }
  }

  // Класс для работы с карточками
  class Cards {
    constructor(quantity) {
      this.quantity = quantity;
    }

    // формирование карточек
    render() {
      const fragment = document.createDocumentFragment();
      const inputArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
      let arrayResult = [];

      for (; arrayResult.length < numberOfCards;) {
        const randomValue = inputArray[Math.floor(Math.random() * inputArray.length)];

        if (!arrayResult.includes(randomValue)) arrayResult.push(randomValue, randomValue);
      }

      arrayResult = shuffle(arrayResult);

      for (let index = 0; index < this.quantity; index++) {
        const element = document.createElement('div');
        $(element).addClass('card');
        $(element).html(`<div class="card__face card__face_front"></div><div class="card__face card__face_back">${arrayResult[index]}</div>`);
        $(element).on('click', checkingCards);

        fragment.append(element);
      }

      $('.loading').fadeIn().fadeOut();
      $('.memory__wrapper')
        .css('display', 'none')
        .append(fragment)
        .delay(800)
        .fadeIn(800);
    }

    // удаление всех карточек
    static remove() {
      $('.card').remove();
    }
  }

  // инициализация панели с контроллерами
  function initControl(selector, startNumberOfCards) {
    const $controls = $(selector);
    numberOfCards = startNumberOfCards;

    function keepTrackOfControls() {
      if (!$(this).hasClass('control__btn_active')) {
        $controls.removeClass('control__btn_active');

        $(this).addClass('control__btn_active');

        if (selector === '.simplicity button') {
          numberOfCards = $(this).text();
          Cards.remove();
          new Cards(numberOfCards).render();
        }
      }
    }

    $controls.on('click', keepTrackOfControls);

    if (startNumberOfCards) new Cards(startNumberOfCards).render();
  }

  // вызов функций и методов
  initControl('.simplicity button', 12);
  initControl('.type button');
}

$(() => {
  initFunction();
});
