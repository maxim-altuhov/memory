import Model from './Model';
import View from './View';

class Presenter {
  constructor(public view: View, public model: Model) {}

  // Добавляем методы в Observer
  setObservers() {
    this.model.subscribe(this._updateView.bind(this));
    this.view.resetCardsEvent.subscribe(this._updateModel.bind(this));
    this.view.setTypeEvent.subscribe(this._setType.bind(this));
    this.view.setCurrentNumberOfCardsEvent.subscribe(this._setCurrentNumberOfCards.bind(this));
  }

  private _setType(value: string) {
    this.model.setProp('setType', value);
    this.model.update();
  }

  private _setCurrentNumberOfCards(value: number) {
    this.model.setProp('currentNumberOfCards', value);
    this.model.update();
  }

  private _updateView(options: IModelOptions) {
    this.view.update(options);
  }

  private _updateModel() {
    this.model.update();
  }
}

export default Presenter;
