import './index.scss';

import $ from 'jquery';
import Model from './js/model';
import View from './js/view';
import Presenter from './js/presenter';

$(() => {
  const model: Model = new Model();
  const view: View = new View();
  const presenter: Presenter = new Presenter(view, model);

  view.registerWith(presenter);
  view.init();
});
