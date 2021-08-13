import $ from 'jquery';
import Presenter from './presenter';

class View {
  $resultMinuts = $('.result__minuts');
  $resultSeconds = $('.result__seconds');
  $elemSeconds = $('.time__seconds');
  $elemMinutes = $('.time__minutes');
  $elemTimeReset = $('.time__reset');
  $elemWithResultTime = $('.time__digital');
  $cards = $('.card');
  presenter: any;

  constructor() {
    this.presenter = null;
  }

  registerWith(presenter: Presenter) {
    this.presenter = presenter;
  }

  init() {
    this.initControlsPanel(this.presenter.getSelectorControlDifficulty());
    this.initControlsPanel(this.presenter.getSelectorControlType());
    this.cardsRender(this.presenter.getType());

    this.$elemTimeReset.on('click', this.handleResetTimer.bind(this));
  }

  // сброс таймера
  handleResetTimer() {
    this.cardsRemove();
    this.endTimer();
    this.cardsRender(this.presenter.getType());
  }

  // метод для установки лучшего результата
  setBestTime() {
    const currentBestTime = this.presenter.getCurrentBestTime();

    if (currentBestTime) {
      this.$resultMinuts.text(currentBestTime.slice(0, 2));
      this.$resultSeconds.text(currentBestTime.slice(2, 4));
    } else {
      this.$resultMinuts.text('-');
      this.$resultSeconds.text('-');
    }
  }

  // методы для работы с таймером
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
  ///

  // открытие/закрытие карточек
  checkThisCard(classDisabled = '') {
    this.$cards = $('.card');

    this.$cards.addClass('not-click');
    setTimeout(() => {
      $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
      this.$cards.removeClass('not-click');
    }, 800);
  }

  // переключение и сравнение карточек с запуском таймера
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
      this.checkThisCard();
    } else if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')) {
      this.checkThisCard('disabled');
    }

    if ($('.disabled').length + 2 === this.presenter.getQuantityCards() && $flippedCard.length === 2) {
      clearInterval(this.presenter.getTimerID());
      this.presenter.setStatusInitTimer(true);

      const resultTime = this.$elemWithResultTime.text();
      const currentBestTime = Number(this.presenter.getCurrentBestTime());

      if (currentBestTime === 0 || currentBestTime > Number(resultTime)) {
        localStorage.setItem(`${this.presenter.getType()}-${this.presenter.getQuantityCards()}`, resultTime);
      }
    }
  }

  // формирование карточек
  cardsRender(currentType: string) {
    this.presenter.setLoadingStatus(true);
    const arrayResult = this.presenter.returnArrayShuffle(currentType);
    const fragment = document.createDocumentFragment();

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
  cardsRemove() {
    this.$cards = $('.card');
    this.$cards.remove();
  }

  // обработка кликов по панели с выборами сложности и типа игры
  handleBtnControlClick($controls: JQuery<HTMLElement>, event: { target: any; }) {
    if (!$(event.target).hasClass('control__btn_active') && !this.presenter.getLoadingStatus()) {
      $controls.removeClass('control__btn_active');
      $(event.target).addClass('control__btn_active');
      this.cardsRemove();
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
  initControlsPanel(selector: string) {
    const $controls = $(selector);
    $controls.on('click', (event) => {
      this.handleBtnControlClick($controls, event);
    });
  }
}

export default View;
