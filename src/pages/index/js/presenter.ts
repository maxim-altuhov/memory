import Model from './model';
class Presenter {
  views;
  model: Model;

  constructor(views: any, model: Model) {
    this.views = views;
    this.model = model;
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

  getSelectorControlDifficulty() {
    return this.model.getSelectorControlDifficulty();
  }

  getSelectorControlType() {
    return this.model.getSelectorControlType();
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
