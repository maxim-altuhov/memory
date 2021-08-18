import $ from 'jquery';
import Presenter from './presenter';

class ViewControlsBlock {
  presenter: any;
  $blockBtnWithType = $('.type button');
  $resultMinuts = $('.result__minuts');
  $resultSeconds = $('.result__seconds');
  $elemSeconds = $('.time__seconds');
  $elemMinutes = $('.time__minutes');
  $elemTimeReset = $('.time__reset');
  $elemWithResultTime = $('.time__digital');
  $btnSetType = $('.type button');
  $btnSetDifficulty = $();

  constructor() {
    this.presenter = null;
  }

  registerWith(presenter: Presenter) {
    this.presenter = presenter;
  }

  init() {
    this.setActiveType();
    this.renderControlBlock();
    this.$btnSetDifficulty = $('.difficulty button');
  }

  initControlDifficulty(handler: () => void): void {
    this.$btnSetDifficulty.on('click', handler);
  }

  initControlType(handler: () => void): void {
    this.$btnSetType.on('click', handler);
  }

  initResetTimer(handler: () => void): void {
    this.$elemTimeReset.on('click', handler);
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
}

export default ViewControlsBlock;
