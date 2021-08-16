import $ from 'jquery';
import Presenter from './presenter';

class ViewControlsBlock {
  $blockBtnWithType = $('.type button');
  $resultMinuts = $('.result__minuts');
  $resultSeconds = $('.result__seconds');
  $elemSeconds = $('.time__seconds');
  $elemMinutes = $('.time__minutes');
  $elemTimeReset = $('.time__reset');
  $elemWithResultTime = $('.time__digital');
  presenter: any;

  constructor() {
    this.presenter = null;
  }

  registerWith(presenter: Presenter) {
    this.presenter = presenter;
  }

  init() {
    this.setActiveType();
    this.renderControlBlock();
    this.initControlsPanel(this.presenter.getSelectorControlDifficulty());
    this.initControlsPanel(this.presenter.getSelectorControlType());
    this.$elemTimeReset.on('click', this.handleResetTimer.bind(this));
  }

  // сброс таймера
  handleResetTimer() {
    if (!this.presenter.getLoadingStatus()) {
      this.presenter.cardsRemove();
      this.endTimer();
      this.presenter.cardsRender(this.presenter.getType());
    }
  }

  // подсветка выбранного типа
  setActiveType() {
    this.$blockBtnWithType.each((i, elem) => {
      // eslint-disable-next-line dot-notation
      if (elem.dataset['type'] === this.presenter.getType()) elem.classList.add('control__btn_active');
    });
  }

  // рендер блока с кнопками управления сложностью
  renderControlBlock() {
    const fragment = document.createDocumentFragment();
    const arrayBtnValue = this.presenter.getStartingNumberOfCards();
    const element = document.createElement('div');
    $(element).addClass('control__wrapper difficulty').text('Выберите сложность: ');

    arrayBtnValue.forEach((value: number) => {
      const html = (value === this.presenter.getQuantityCards()) ? `<button class="control__btn control__btn_active">${value}</button>` : `<button class="control__btn">${value}</button>`;

      $(element).append(html);
    });

    fragment.append(element);
    $('#block-difficulty').append(fragment);
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

  // проверить/установить лучшее время прохождения игры
  checkResultTime() {
    const resultTime = this.$elemWithResultTime.text();
    const currentBestTime = Number(this.presenter.getCurrentBestTime());

    if (currentBestTime === 0 || currentBestTime > Number(resultTime)) {
      localStorage.setItem(`${this.presenter.getType()}-${this.presenter.getQuantityCards()}`, resultTime);
    }
  }

  // обработка кликов по панели с выборами сложности и типа игры
  handleBtnControlClick($controls: JQuery<HTMLElement>, event: { target: any; }) {
    if (!$(event.target).hasClass('control__btn_active') && !this.presenter.getLoadingStatus()) {
      $controls.removeClass('control__btn_active');
      $(event.target).addClass('control__btn_active');
      this.presenter.cardsRemove();
      this.endTimer();

      const paramSetType = $('.type .control__btn_active').data('type');
      this.presenter.setType(paramSetType);

      if ($(event.target).parent().hasClass('difficulty')) {
        this.presenter.setQuantityCards(Number($(event.target).text()));
        this.presenter.cardsRender(paramSetType);
      }

      if ($(event.target).data('type') === 'numbers') {
        this.presenter.cardsRender('numbers');
      }

      if ($(event.target).data('type') === 'words') {
        this.presenter.cardsRender('words');
      }

      if ($(event.target).data('type') === 'colors') {
        this.presenter.cardsRender('colors');
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

export default ViewControlsBlock;
