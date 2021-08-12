class Model {
  numberOfCardsOptions = [8, 12, 16];
  cardsTypeOptions = ['numbers', 'words', 'colors'];
  quantityCards = this.numberOfCardsOptions[1];
  setType = this.cardsTypeOptions[0];
  loadingContent = false;
  allowInitTimer = true;
  timerID: NodeJS.Timeout | undefined;
  inputArray: {[index: string]: (string | number)[]} = {
    numbers: Array.from({ length: 100 }, () => Math.floor(Math.random() * 100)),
    words: ['съезд', 'мэр', 'учет', 'цель', 'мост', 'дух', 'апрель', 'год', 'человек', 'время', 'дело', 'жизнь', 'день', 'рука', 'работа', 'слово', 'место', 'вопрос', 'лицо', 'глаз', 'страна', 'друг', 'сторона', 'дом', 'случай', 'ребенок', 'голова', 'система', 'вид', 'конец', 'город', 'часть', 'женщина', 'земля', 'решение', 'власть', 'машина', 'закон', 'час', 'образ', 'отец', 'история', 'нога', 'вода', 'война', 'дверь', 'бог', 'народ', 'область', 'число', 'голос', 'группа', 'жена', 'процесс', 'условие', 'книга', 'ночь', 'суд', 'деньга', 'уровень', 'начало', 'стол', 'связь', 'имя', 'форма', 'путь', 'статья', 'школа', 'душа', 'дорога', 'язык', 'взгляд', 'момент', 'минута', 'месяц', 'порядок', 'цель', 'муж', 'помощь', 'мысль', 'вечер', 'орган', 'рынок', 'партия', 'роль', 'смысл', 'мама', 'мера', 'улица'],
    colors: ['FF0000', 'FFFF00', 'FFFFFF', '4169E1', '696969', '32CD32', 'FF1493', '800080', '00FFFF', 'FFA500', '20B2AA', 'FFDAB9', 'ADFF2F', 'FF6347', 'FF69B4', 'F0E68C'],
  }

  getInputArray(value: string) {
    return this.inputArray[value];
  }

  getTimerID() {
    return this.timerID;
  }

  setTimerID(value: NodeJS.Timeout) {
    this.timerID = value;
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

  // метод для перемешивания случайным образом эл-тов входящего массива
  static shuffle(array: (string | number)[]): (string | number)[] {
    let currentIndex = array.length;
    let temporaryValue: (string | number);
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

export default Model;
