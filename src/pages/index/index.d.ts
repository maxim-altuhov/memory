interface IModelOptions {
  [key: string]: any;
  numberOfCards: number[];
  cardsType: object;
  currentBestTime: string | null;
  currentNumberOfCards: string;
  setType: string;
  resultArray: (string | number)[];
  inputArray: {
    [key: string]: any;
    numbers: number[];
    words: string[];
    colors: string[];
  };
}
