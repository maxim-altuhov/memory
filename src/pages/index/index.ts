import './index.scss';

import $ from 'jquery';

$(() => {
  let quantityCards: number = 12;
  let setType: string = 'numbers';
  let loadingContent: boolean = false;
  let allowInitTimer: boolean = true;
  // eslint-disable-next-line no-undef
  let timerID: NodeJS.Timeout;

  // функ. установки лучшего результата
  const $resultMinuts = $('.result__minuts');
  const $resultSeconds = $('.result__seconds');

  function setBestTime(): void {
    const currentBestTime: string = localStorage.getItem(`${setType}-${quantityCards}`);

    if (currentBestTime) {
      $resultMinuts.text(currentBestTime.slice(0, 2));
      $resultSeconds.text(currentBestTime.slice(2, 4));
    } else {
      $resultMinuts.text('-');
      $resultSeconds.text('-');
    }
  }

  // функ. для работы с таймером
  const $elemSeconds = $('.time__seconds');
  const $elemMinutes = $('.time__minutes');

  function endTimer(): void {
    clearInterval(timerID);
    allowInitTimer = true;
    $elemSeconds.text('00');
    $elemMinutes.text('00');
  }

  function startTimer(): void {
    let seconds: number = Number($elemSeconds.text());
    let minutes: number = Number($elemMinutes.text());

    seconds += 1;
    $elemSeconds.text(seconds < 10 ? `0${seconds}` : seconds);

    if (seconds === 60) {
      minutes += 1;
      $elemSeconds.text('00');
      $elemMinutes.text(minutes < 10 ? `0${minutes}` : minutes);
    }
  }

  ///

  // функ. для перемешивания случайным образом эл-тов массива
  function shuffle(array: (string | number)[]) {
    let currentIndex: number = array.length;
    let temporaryValue: (string | number);
    let randomIndex: number;

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
  function checkingCards(): void {
    if (allowInitTimer) {
      timerID = setInterval(startTimer, 1000);
      allowInitTimer = false;
    }

    function checkThisCard(classDisabled: string = '') {
      const $cards = $('.card');

      $cards.addClass('not-click');
      setTimeout(() => {
        $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
        $cards.removeClass('not-click');
      }, 800);
    }

    // eslint-disable-next-line no-undef
    let $flippedCard: JQuery < HTMLElement >;

    if ($('.is-flipped').length < 2) {
      $(this).toggleClass('is-flipped');
      $flippedCard = $('.is-flipped');
    }

    if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') !== $flippedCard.eq(1).data('value')) {
      checkThisCard();
    } else if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')) {
      checkThisCard('disabled');
    }

    if ($('.disabled').length + 2 === quantityCards && $flippedCard.length === 2) {
      clearInterval(timerID);
      allowInitTimer = true;

      const resultTime: string = $('.time__digital').text();

      if (Number(localStorage.getItem(`${setType}-${quantityCards}`)) === 0 || Number(localStorage.getItem(`${setType}-${quantityCards}`)) > Number(resultTime)) {
        localStorage.setItem(`${setType}-${quantityCards}`, resultTime);
      }
    }
  }

  // формирование карточек
  function cardsRender(currentType: string): void {
    loadingContent = true;
    const fragment = document.createDocumentFragment();
    let inputArray: (string | any)[];

    if (currentType === 'numbers') {
      inputArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100));
    } else if (currentType === 'words') {
      inputArray = ['съезд', 'мэр', 'учет', 'цель', 'мост', 'дух', 'апрель', 'год', 'человек', 'время', 'дело', 'жизнь', 'день', 'рука', 'работа', 'слово', 'место', 'вопрос', 'лицо', 'глаз', 'страна', 'друг', 'сторона', 'дом', 'случай', 'ребенок', 'голова', 'система', 'вид', 'конец', 'город', 'часть', 'женщина', 'земля', 'решение', 'власть', 'машина', 'закон', 'час', 'образ', 'отец', 'история', 'нога', 'вода', 'война', 'дверь', 'бог', 'народ', 'область', 'число', 'голос', 'группа', 'жена', 'процесс', 'условие', 'книга', 'ночь', 'суд', 'деньга', 'уровень', 'начало', 'стол', 'связь', 'имя', 'форма', 'путь', 'статья', 'школа', 'душа', 'дорога', 'язык', 'взгляд', 'момент', 'минута', 'месяц', 'порядок', 'цель', 'муж', 'помощь', 'мысль', 'вечер', 'орган', 'рынок', 'партия', 'роль', 'смысл', 'мама', 'мера', 'улица'];
    } else if (currentType === 'colors') {
      inputArray = ['FF0000', 'FFFF00', 'FFFFFF', '4169E1', '696969', '32CD32', 'FF1493', '800080', '00FFFF', 'FFA500', '20B2AA', 'FFDAB9', 'ADFF2F', 'FF6347', 'FF69B4', 'F0E68C'];
    }

    let arrayResult: (string | number)[] = [];

    for (; arrayResult.length < quantityCards;) {
      // eslint-disable-next-line max-len
      const randomValue: (string | number) = inputArray[Math.floor(Math.random() * inputArray.length)];

      if (!arrayResult.includes(randomValue)) arrayResult.push(randomValue, randomValue);
    }

    arrayResult = shuffle(arrayResult);

    for (let index = 0; index < quantityCards; index++) {
      const element = document.createElement('div');
      const html = (currentType === 'colors') ? `<div class="card__face card__face_front"></div><div class="card__face card__face_back" style="background-color:#${arrayResult[index]}"></div>` : `<div class="card__face card__face_front"></div><div class="card__face card__face_back">${arrayResult[index]}</div>`;

      $(element).addClass('card')
        .data('value', `${arrayResult[index]}`)
        .html(html)
        .on('click', checkingCards);

      fragment.append(element);
    }

    $('.loading').fadeIn().fadeOut(() => {
      $('.memory__wrapper').css('display', 'none').append(fragment).fadeIn(800);
      loadingContent = false;
      setBestTime();
    });
  }

  // удаление всех карточек
  function cardsRemove(): void {
    $('.card').remove();
  }

  // инициализация панели с контроллерами
  function initControl(selector: string): void {
    const $controls = $(selector);

    function keepTrackOfControls(): void {
      if (!$(this).hasClass('control__btn_active') && !loadingContent) {
        $controls.removeClass('control__btn_active');
        $(this).addClass('control__btn_active');
        cardsRemove();
        endTimer();

        setType = $('.type .control__btn_active').data('type');

        if ($(this).parent().hasClass('simplicity')) {
          quantityCards = Number($(this).text());
          cardsRender(setType);
        }

        if ($(this).data('type') === 'numbers') {
          cardsRender('numbers');
        }

        if ($(this).data('type') === 'words') {
          cardsRender('words');
        }

        if ($(this).data('type') === 'colors') {
          cardsRender('colors');
        }
      }
    }

    $controls.on('click', keepTrackOfControls);
  }

  // вызовы и обработчики
  initControl('.simplicity button');
  initControl('.type button');
  cardsRender('numbers');

  $('.time__reset').on('click', () => {
    cardsRemove();
    endTimer();
    cardsRender(setType);
  });
});
