import './index.scss';

import $ from 'jquery';
import checkedFocus from './ts/checkedFocus';
import Model from './ts/model';
import ViewCardsBlock from './ts/viewCardsBlock';
import ViewControlsBlock from './ts/viewControlsBlock';
import Presenter from './ts/presenter';

$(() => {
  checkedFocus();

  const model: Model = new Model();
  const views = { viewCards: new ViewCardsBlock(), viewControls: new ViewControlsBlock() };
  const presenter: Presenter = new Presenter(views, model);

  views.viewCards.registerWith(presenter);
  views.viewControls.registerWith(presenter);
  views.viewCards.init();
  views.viewControls.init();
  presenter.setEvent();
});
