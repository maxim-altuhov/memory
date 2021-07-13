import './index.scss';

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

function initFunction() {
  let startNumberOfCards = 12;

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

    if (flippedCard.length === 2 && flippedCard.eq(0).data('value') !== flippedCard.eq(1).data('value')) {
      checkThisCard();
    } else if (flippedCard.length === 2 && flippedCard.eq(0).data('value') === flippedCard.eq(1).data('value')) {
      checkThisCard('disabled');
    }
  }

  // Класс для работы с карточками
  class Cards {
    constructor(quantity) {
      this.quantity = quantity;
    }

    // формирование карточек
    render(currentType) {
      const fragment = document.createDocumentFragment();
      let inputArray;

      if (currentType === 'numbers') {
        inputArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
      } else if (currentType === 'words') {
        inputArray = ['съезд', 'мэр', 'учет', 'цель', 'мост', 'дух', 'апрель', 'год', 'человек', 'время', 'дело', 'жизнь', 'день', 'рука', 'работа', 'слово', 'место', 'вопрос', 'лицо', 'глаз', 'страна', 'друг', 'сторона', 'дом', 'случай', 'ребенок', 'голова', 'система', 'вид', 'конец', 'город', 'часть', 'женщина', 'земля', 'решение', 'власть', 'машина', 'закон', 'час', 'образ', 'отец', 'история', 'нога', 'вода', 'война', 'дверь', 'бог', 'народ', 'область', 'число', 'голос', 'группа', 'жена', 'процесс', 'условие', 'книга', 'ночь', 'суд', 'деньга', 'уровень', 'начало', 'стол', 'связь', 'имя', 'форма', 'путь', 'статья', 'школа', 'душа', 'дорога', 'язык', 'взгляд', 'момент', 'минута', 'месяц', 'порядок', 'цель', 'муж', 'помощь', 'мысль', 'вечер', 'орган', 'рынок', 'партия', 'роль', 'смысл', 'мама', 'мера', 'улица'];
      } else if (currentType === 'colors') {
        inputArray = ['FF0000', 'FFFF00', 'FFFFFF', '4169E1', '696969', '32CD32', 'FF1493', '800080', '00FFFF', 'FFA500', '20B2AA', 'FFDAB9', 'ADFF2F', 'FF6347', 'FF69B4', 'F0E68C'];
      }

      let arrayResult = [];

      for (; arrayResult.length < this.quantity;) {
        const randomValue = inputArray[Math.floor(Math.random() * inputArray.length)];

        if (!arrayResult.includes(randomValue)) arrayResult.push(randomValue, randomValue);
      }

      arrayResult = shuffle(arrayResult);

      for (let index = 0; index < this.quantity; index++) {
        const element = document.createElement('div');
        const html = (currentType === 'colors') ? `<div class="card__face card__face_front"></div><div class="card__face card__face_back" style="background-color:#${arrayResult[index]}"></div>` : `<div class="card__face card__face_front"></div><div class="card__face card__face_back">${arrayResult[index]}</div>`;

        $(element).addClass('card')
          .data('value', `${arrayResult[index]}`)
          .html(html)
          .on('click', checkingCards);

        fragment.append(element);
      }

      $('.loading').fadeIn().fadeOut();
      $('.memory__wrapper').css('display', 'none')
        .append(fragment)
        .delay(800)
        .fadeIn(850);
    }

    // удаление всех карточек
    static remove() {
      $('.card').remove();
    }
  }

  // инициализация панели с контроллерами
  function initControl(selector) {
    const $controls = $(selector);

    function keepTrackOfControls() {
      const setType = $('.type .control__btn_active').data('type');

      if (!$(this).hasClass('control__btn_active')) {
        $controls.removeClass('control__btn_active');

        $(this).addClass('control__btn_active');
        Cards.remove();

        if ($(this).parent().hasClass('simplicity')) {
          startNumberOfCards = $(this).text();
          new Cards(startNumberOfCards).render(setType);
        }

        if ($(this).data('type') === 'numbers') {
          new Cards(startNumberOfCards).render('numbers');
        }

        if ($(this).data('type') === 'words') {
          new Cards(startNumberOfCards).render('words');
        }

        if ($(this).data('type') === 'colors') {
          new Cards(startNumberOfCards).render('colors');
        }
      }
    }

    $controls.on('click', keepTrackOfControls);
  }

  // вызов функций и методов
  initControl('.simplicity button');
  initControl('.type button');
  new Cards(startNumberOfCards).render('numbers');
}

$(() => {
  initFunction();
});
