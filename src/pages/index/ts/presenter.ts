import $ from 'jquery';
import Model from './model';

class Presenter {
  views;
  model: Model;

  constructor(views: any, model: Model) {
    this.views = views;
    this.model = model;
  }

  setEvent() {
    this.views.viewControls.initResetTimer(this.resetTimer.bind(this));
    this.views.viewControls.initControlDifficulty(this.initControlEvent.bind(this));
    this.views.viewControls.initControlType(this.initControlEvent.bind(this));
    this.views.viewCards.initCheckingCards(this.initCheckingCards.bind(this));

    this.model.resetTimerEvent.attach(this.handleResetTimer.bind(this));
    this.model.btnControlEvent.attach(this.handleBtnControlClick.bind(this));
    this.model.checkCardsEvent.attach(this.handleCheckingCards.bind(this));
  }

  // сброс таймера
  handleResetTimer() {
    if (!this.getLoadingStatus()) {
      this.cardsRemove();
      this.views.viewControls.endTimer();
      this.cardsRender(this.getType());
    }
  }

  // обработка кликов по панели с выборами сложности и типа игры
  handleBtnControlClick(event: any) {
    event.preventDefault();

    if (!$(event.target).hasClass('control__btn_active') && !this.getLoadingStatus()) {
      const $allBtnsControl = $(event.target).parent().children();

      $allBtnsControl.removeClass('control__btn_active');
      $(event.target).addClass('control__btn_active');
      this.cardsRemove();
      this.views.viewControls.endTimer();

      const paramSetType = $('.type .control__btn_active').data('type');
      this.setType(paramSetType);

      if ($(event.target).parent().hasClass('difficulty')) {
        this.setQuantityCards(Number($(event.target).text()));
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

  // переключение и сравнение карточек с запуском таймера
  handleCheckingCards(event: any) {
    event.preventDefault();

    if ($(event.target).parent().hasClass('card') || $(event.target).hasClass('card')) {
      if (this.getStatusInitTimer()) {
        const initTimer = setInterval(() => {
          this.startTimer();
        }, 1000);

        this.setTimerID(initTimer);
        this.setStatusInitTimer(false);
      }

      let $flippedCard = $('.is-flipped');

      if ($('.is-flipped').length < 2) {
        if ($(event.target).hasClass('card')) {
          $(event.target).toggleClass('is-flipped');
        } else {
          $(event.target).parent().toggleClass('is-flipped');
        }
        $flippedCard = $('.is-flipped');
      }

      if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') !== $flippedCard.eq(1).data('value')) {
        this.views.viewCards.checkThisCard();
      } else if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')) {
        this.views.viewCards.checkThisCard('disabled');
      }

      if ($('.disabled').length + 2 === this.getQuantityCards() && $flippedCard.length === 2) {
        clearInterval(this.getTimerID());
        this.setStatusInitTimer(true);
        this.checkResultTime();
      }
    }
  }

  resetTimer() {
    this.model.resetTimer();
  }

  initControlEvent() {
    this.model.initControlEvent();
  }

  initCheckingCards() {
    this.model.initCardsEvent();
  }

  getStartingNumberOfCards() {
    return this.model.getStartingNumberOfCards();
  }

  getCurrentBestTime() {
    return this.model.getCurrentBestTime();
  }

  getQuantityCards() {
    return this.model.getQuantityCards();
  }

  setQuantityCards(value: number) {
    this.model.quantityCards = value;
  }

  getType() {
    return this.model.initGetType();
  }

  setType(value: string) {
    this.model.initSetType(value);
  }

  getLoadingStatus() {
    return this.model.getLoadingStatus();
  }

  setLoadingStatus(value: boolean) {
    this.model.setLoadingStatus(value);
  }

  getStatusInitTimer() {
    return this.model.getStatusInitTimer();
  }

  setStatusInitTimer(value: boolean) {
    this.model.setStatusInitTimer(value);
  }

  getTimerID() {
    return this.model.getTimerID();
  }

  setTimerID(value: NodeJS.Timeout) {
    this.model.timerID = value;
  }

  getInputArray(value: string) {
    return this.model.getInputArray(value);
  }

  returnArrayShuffle(currentType: string): (string | number)[] {
    return this.model.returnArrayShuffle(currentType);
  }

  setBestTime() {
    this.views.viewControls.setBestTime();
  }

  checkResultTime() {
    this.views.viewControls.checkResultTime();
  }

  startTimer() {
    this.views.viewControls.startTimer();
  }

  cardsRemove() {
    this.views.viewCards.cardsRemove();
  }

  cardsRender(initValue: string) {
    this.views.viewCards.cardsRender(initValue);
  }
}

export default Presenter;
