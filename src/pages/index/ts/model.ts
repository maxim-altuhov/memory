import Event from './event';

class Model {
  resetTimerEvent: Event;
  btnControlEvent: Event;
  checkCardsEvent: Event;
  numberOfCardsOptions = [8, 12, 16];
  cardsTypeOptions = ['numbers', 'words', 'colors'];
  currentBestTime: null | string = null;
  quantityCards = this.numberOfCardsOptions[1];
  setType = 'numbers'; // ['numbers', 'words', 'colors']
  loadingContent = false;
  allowInitTimer = true;
  timerID: any
  inputArray: {[index: string]: (string | number)[]} = {
    numbers: Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)),
    words: ['съезд', 'мэр', 'учет', 'цель', 'мост', 'дух', 'апрель', 'год', 'человек', 'время', 'дело', 'жизнь', 'день', 'рука', 'работа', 'слово', 'место', 'вопрос', 'лицо', 'глаз', 'страна', 'друг', 'сторона', 'дом', 'случай', 'ребенок', 'голова', 'система', 'вид', 'конец', 'город', 'часть', 'женщина', 'земля', 'решение', 'власть', 'машина', 'закон', 'час', 'образ', 'отец', 'история', 'нога', 'вода', 'война', 'дверь', 'бог', 'народ', 'область', 'число', 'голос', 'группа', 'жена', 'процесс', 'условие', 'книга', 'ночь', 'суд', 'деньга', 'уровень', 'начало', 'стол', 'связь', 'имя', 'форма', 'путь', 'статья', 'школа', 'душа', 'дорога', 'язык', 'взгляд', 'момент', 'минута', 'месяц', 'порядок', 'цель', 'муж', 'помощь', 'мысль', 'вечер', 'орган', 'рынок', 'партия', 'роль', 'смысл', 'мама', 'мера', 'улица'],
    colors: ['FF0000', 'FFFF00', 'FFFFFF', '4169E1', '696969', '32CD32', 'FF1493', '800080', '00FFFF', 'FFA500', '20B2AA', 'FFDAB9', 'ADFF2F', 'FF6347', 'FF69B4', 'F0E68C'],
  }

  constructor() {
    this.resetTimerEvent = new Event();
    this.btnControlEvent = new Event();
    this.checkCardsEvent = new Event();
  }

  resetTimer() {
    this.resetTimerEvent.notify();
  }

  initControlEvent() {
    this.btnControlEvent.notify(window.event);
  }

  initCardsEvent() {
    this.checkCardsEvent.notify(window.event);
  }

  getStartingNumberOfCards() {
    return this.numberOfCardsOptions;
  }

  getCurrentBestTime() {
    this.currentBestTime = localStorage.getItem(`${this.setType}-${this.quantityCards}`);
    return this.currentBestTime;
  }

  getQuantityCards() {
    return this.quantityCards;
  }

  setQuantityCards(value: number) {
    this.quantityCards = value;
  }

  initGetType() {
    return this.setType;
  }

  initSetType(value: string) {
    this.setType = value;
  }

  getLoadingStatus() {
    return this.loadingContent;
  }

  setLoadingStatus(value: boolean) {
    this.loadingContent = value;
  }

  getStatusInitTimer() {
    return this.allowInitTimer;
  }

  setStatusInitTimer(value: boolean) {
    this.allowInitTimer = value;
  }

  getTimerID() {
    return this.timerID;
  }

  setTimerID(value: NodeJS.Timeout) {
    this.timerID = value;
  }

  getInputArray(value: string) {
    return this.inputArray[value];
  }

  // метод для перемешивания случайным образом эл-тов входящего массива
  returnArrayShuffle(currentType: string): (string | number)[] {
    let inputArray: (string | number)[] = this.getInputArray(currentType);
    let arrayResult: (string | number)[] = [];

    for (; arrayResult.length < this.getQuantityCards();) {
      const randomNumber = Math.floor(Math.random() * inputArray.length);
      const randomValue = inputArray[randomNumber];

      if (!arrayResult.includes(randomValue)) arrayResult.push(randomValue, randomValue);
    }

    let currentIndex = arrayResult.length;
    let temporaryValue: (string | number);
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = arrayResult[currentIndex];
      arrayResult[currentIndex] = arrayResult[randomIndex];
      arrayResult[randomIndex] = temporaryValue;
    }

    return arrayResult;
  }
}

export default Model;
