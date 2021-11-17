import Observer from '../patterns/Observer';

class Model extends Observer {
  constructor(public options: IModelOptions) {
    super();
  }

  update() {
    this._returnArrayShuffle();
    this._getCurrentBestTime();
    this.notify(this.options);
  }

  setProp(prop: string, value: any) {
    this.options[prop] = value;
  }

  private _getCurrentBestTime() {
    this.options.currentBestTime = localStorage.getItem(
      `${this.options.setType}-${this.options.currentNumberOfCards}`,
    );
  }

  // метод для перемешивания случайным образом эл-тов входящего массива
  private _returnArrayShuffle() {
    const { setType, currentNumberOfCards } = this.options;
    const inputArray = this.options.inputArray[setType];
    const resultArray: (number | string)[] = [];

    for (; resultArray.length < Number(currentNumberOfCards); ) {
      const randomNumber = Math.floor(Math.random() * inputArray.length);
      const randomValue = inputArray[randomNumber];

      if (!resultArray.includes(randomValue)) resultArray.push(randomValue, randomValue);
    }

    let currentIndex = resultArray.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = resultArray[currentIndex];
      resultArray[currentIndex] = resultArray[randomIndex];
      resultArray[randomIndex] = temporaryValue;
    }

    this.options.resultArray = resultArray;
  }
}

export default Model;
