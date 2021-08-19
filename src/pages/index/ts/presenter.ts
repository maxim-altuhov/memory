/* eslint-disable max-len */
import Model from './model';

class Presenter {
  views;
  model: Model;
  viewCards: any;
  viewControls: any;

  constructor(views: any, model: Model) {
    this.views = views;
    this.model = model;
  }

  setEvent() {
    this.viewCards = this.views.viewCards;
    this.viewControls = this.views.viewControls;

    this.viewControls.initResetTimer(this.resetTimer.bind(this));
    this.viewControls.initControlDifficulty(this.initControlEvent.bind(this));
    this.viewControls.initControlType(this.initControlEvent.bind(this));
    this.viewCards.initCheckingCards(this.initCheckingCards.bind(this));

    this.model.resetTimerEvent.attach(this.viewControls.handleResetTimer.bind(this.viewControls));
    this.model.btnControlEvent.attach(this.viewControls.handleBtnControlClick.bind(this.viewControls));
    this.model.checkCardsEvent.attach(this.viewCards.handleCheckingCards.bind(this.viewCards));
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
    this.viewControls.setBestTime();
  }

  checkResultTime() {
    this.viewControls.checkResultTime();
  }

  startTimer() {
    this.viewControls.startTimer();
  }

  cardsRemove() {
    this.viewCards.cardsRemove();
  }

  cardsRender(initValue: string) {
    this.viewCards.cardsRender(initValue);
  }
}

export default Presenter;
