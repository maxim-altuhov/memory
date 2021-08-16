import './index.scss';

import $ from 'jquery';
import Model from './js/model';
import ViewCardsBlock from './js/viewCardsBlock';
import ViewControlsBlock from './js/viewControlsBlock';
import Presenter from './js/presenter';

$(() => {
  const model: Model = new Model();
  const views = { viewCards: new ViewCardsBlock(), viewControls: new ViewControlsBlock() };
  const presenter: Presenter = new Presenter(views, model);

  views.viewCards.registerWith(presenter);
  views.viewControls.registerWith(presenter);
  views.viewCards.init();
  views.viewControls.init();
});
