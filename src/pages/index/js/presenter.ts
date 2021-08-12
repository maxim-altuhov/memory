// import $ from 'jquery';
import Model from './model';
import View from './view';

class Presenter {
  view: View;
  model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
  }

  getInputArray(value:string) {
    return this.model.getInputArray(value);
  }

  getTimerID() {
    return this.model.getTimerID();
  }

  setTimerID(value: NodeJS.Timeout) {
    this.model.timerID = value;
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

  static shuffle(array: (string | number)[]) {
    return Model.shuffle(array);
  }
}

export default Presenter;
