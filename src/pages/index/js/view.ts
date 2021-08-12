import $ from 'jquery';
import Presenter from './presenter';

class View {
  $resultMinuts = $('.result__minuts');
  $resultSeconds = $('.result__seconds');
  $elemSeconds = $('.time__seconds');
  $elemMinutes = $('.time__minutes');
  presenter: any;

  constructor() {
    this.presenter = null;
  }

  init() {
    this.initControl('.difficulty button');
    this.initControl('.type button');
    this.cardsRender('numbers');

    $('.time__reset').on('click', () => {
      View.cardsRemove();
      this.endTimer();
      this.cardsRender(this.presenter.getType());
    });
  }

  registerWith(presenter: Presenter) {
    this.presenter = presenter;
  }

  // метод для установки лучшего результата
  setBestTime() {
    const currentBestTime = localStorage.getItem(`${this.presenter.getType()}-${this.presenter.getQuantityCards()}`);

    if (currentBestTime) {
      this.$resultMinuts.text(currentBestTime.slice(0, 2));
      this.$resultSeconds.text(currentBestTime.slice(2, 4));
    } else {
      this.$resultMinuts.text('-');
      this.$resultSeconds.text('-');
    }
  }

  // метод для работы с таймером
  endTimer() {
    clearInterval(this.presenter.getTimerID());
    this.presenter.setStatusInitTimer(true);
    this.$elemSeconds.text('00');
    this.$elemMinutes.text('00');
  }

  startTimer() {
    let seconds = Number(this.$elemSeconds.text());
    let minutes = Number(this.$elemMinutes.text());

    seconds += 1;
    this.$elemSeconds.text(seconds < 10 ? `0${seconds}` : seconds);

    if (seconds === 60) {
      minutes += 1;
      this.$elemSeconds.text('00');
      this.$elemMinutes.text(minutes < 10 ? `0${minutes}` : minutes);
    }
  }

  static checkThisCard(classDisabled = '') {
    const $cards = $('.card');

    $cards.addClass('not-click');
    setTimeout(() => {
      $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
      $cards.removeClass('not-click');
    }, 800);
  }

  // переключение и сравнение карточек
  checkingCards(event: { target: any; }) {
    if (this.presenter.getStatusInitTimer()) {
      const initTimer = setInterval(this.startTimer.bind(this), 1000);

      this.presenter.setTimerID(initTimer);
      this.presenter.setStatusInitTimer(false);
    }

    let $flippedCard = $('.is-flipped');

    if ($('.is-flipped').length < 2) {
      $(event.target).parent().toggleClass('is-flipped');
      $flippedCard = $('.is-flipped');
    }

    if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') !== $flippedCard.eq(1).data('value')) {
      View.checkThisCard();
    } else if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')) {
      View.checkThisCard('disabled');
    }

    if ($('.disabled').length + 2 === this.presenter.getQuantityCards() && $flippedCard.length === 2) {
      clearInterval(this.presenter.getTimerID());
      this.presenter.setStatusInitTimer(true);

      const resultTime = $('.time__digital').text();
      const currentBestTime = Number(localStorage.getItem(`${this.presenter.getType()}-${this.presenter.getQuantityCards()}`));

      if (currentBestTime === 0 || currentBestTime > Number(resultTime)) {
        localStorage.setItem(`${this.presenter.getType()}-${this.presenter.getQuantityCards()}`, resultTime);
      }
    }
  }

  // формирование карточек
  cardsRender(currentType: string) {
    this.presenter.setLoadingStatus(true);

    const fragment = document.createDocumentFragment();
    let inputArray: (string | number)[] = this.presenter.getInputArray(currentType);
    let arrayResult: (string | number)[] = [];

    for (; arrayResult.length < this.presenter.getQuantityCards();) {
      const randomNumber = Math.floor(Math.random() * inputArray.length);
      const randomValue = inputArray[randomNumber];

      if (!arrayResult.includes(randomValue)) arrayResult.push(randomValue, randomValue);
    }

    arrayResult = Presenter.shuffle(arrayResult);

    for (let index = 0; index < this.presenter.getQuantityCards(); index++) {
      const element = document.createElement('div');
      const html = (currentType === 'colors') ? `<div class="card__face card__face_front"></div><div class="card__face card__face_back" style="background-color:#${arrayResult[index]}"></div>` : `<div class="card__face card__face_front"></div><div class="card__face card__face_back">${arrayResult[index]}</div>`;

      $(element).addClass('card')
        .data('value', `${arrayResult[index]}`)
        .html(html)
        .on('click', (event) => {
          this.checkingCards(event);
        });

      fragment.append(element);
    }

    $('.loading').fadeIn().fadeOut(() => {
      $('.memory__wrapper').css('display', 'none').append(fragment).fadeIn(800);
      this.presenter.setLoadingStatus(false);
      this.setBestTime();
    });
  }

  // удаление всех карточек
  static cardsRemove() {
    $('.card').remove();
  }

  keepTrackOfControls($controls: JQuery<HTMLElement>, event: { target: any; }) {
    if (!$(event.target).hasClass('control__btn_active') && !this.presenter.getLoadingStatus()) {
      $controls.removeClass('control__btn_active');
      $(event.target).addClass('control__btn_active');
      View.cardsRemove();
      this.endTimer();

      const paramSetType = $('.type .control__btn_active').data('type');
      this.presenter.setType(paramSetType);

      if ($(event.target).parent().hasClass('difficulty')) {
        this.presenter.setQuantityCards(Number($(event.target).text()));
        this.cardsRender(paramSetType);
      }

      if ($(event.target).data('type') === 'numbers') {
        this.cardsRender('numbers');
      }

      if ($(event.target).data('type') === 'words') {
        this.cardsRender('words');
      }

      if ($(event.target).data('type') === 'colors') {
        this.cardsRender('colors');
      }
    }
  }

  // инициализация панели с контроллерами
  initControl(selector: string) {
    const $controls = $(selector);
    $controls.on('click', (event) => {
      this.keepTrackOfControls($controls, event);
    });
  }
}

export default View;
