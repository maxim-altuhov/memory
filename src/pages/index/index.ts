/// <reference path='./index.d.ts' />
import './index.scss';
import $ from 'jquery';
import checkingFocus from './ts/checkingFocus';
import Model from './layers/Model';
import View from './layers/View';
import Presenter from './layers/Presenter';
import { numbers, words, colors } from './data/data';

$(() => {
  checkingFocus();

  const options: IModelOptions = {
    numberOfCards: [8, 12, 16],
    cardsType: {
      numbers: 'числа',
      words: 'слова',
      colors: 'цвета',
    },
    currentBestTime: null,
    currentNumberOfCards: '12',
    setType: 'numbers',
    resultArray: [],
    inputArray: {
      numbers,
      words,
      colors,
    },
  };

  const model = new Model(options);
  const view = new View();
  const presenter = new Presenter(view, model);

  presenter.setObservers();
  model.update();
});
