import Observer from '../patterns/Observer';

class View {
  $selector!: JQuery<HTMLElement>;
  $blockControl!: JQuery<HTMLElement>;
  $cardsWrapper!: JQuery<HTMLElement>;
  $cards!: JQuery<HTMLElement>;
  $resultMinuts!: JQuery<HTMLElement>;
  $resultSeconds!: JQuery<HTMLElement>;
  $elemSeconds!: JQuery<HTMLElement>;
  $elemMinutes!: JQuery<HTMLElement>;
  $elemTimeReset!: JQuery<HTMLElement>;
  $elemWithResultTime!: JQuery<HTMLElement>;
  $btnControl!: JQuery<HTMLElement>;
  savedStatObj: { [key: string]: any };
  setTypeEvent: Observer;
  setCurrentNumberOfCardsEvent: Observer;
  resetCardsEvent: Observer;

  constructor() {
    this.setTypeEvent = new Observer();
    this.setCurrentNumberOfCardsEvent = new Observer();
    this.resetCardsEvent = new Observer();
    this.savedStatObj = {
      isFirstInit: true,
      loadingContent: false,
      allowInitTimer: true,
      timerID: null,
    };
  }

  update(options: IModelOptions) {
    if (this.savedStatObj['isFirstInit']) {
      this._init(options);
      this.savedStatObj['isFirstInit'] = false;
    }
    this._cardsRender(options);
  }

  private _init(options: IModelOptions) {
    this._getSelectors();
    this._renderControlBlock(options, 'numberOfCards');
    this._renderControlBlock(options, 'cardsType');
    this._setActiveType(options, 'setType');
    this._setActiveType(options, 'currentNumberOfCards');
    this._setEvents(options);
  }

  // рендер блока с кнопками управления сложностью
  private _renderControlBlock(options: IModelOptions, blockName: string) {
    const fragment = document.createDocumentFragment();
    const element = document.createElement('div');
    let btnValuesArr;

    if (blockName === 'numberOfCards') {
      btnValuesArr = options[blockName];
      $(element).addClass('control__wrapper difficulty').text('Выберите сложность: ');
    } else {
      btnValuesArr = Object.entries(options[blockName]);
      $(element).addClass('control__wrapper type').text('Выберите тип игры: ');
    }

    btnValuesArr.forEach((value) => {
      // prettier-ignore
      const htmlBlock = (blockName === 'numberOfCards')       
          ? `<button class="control__btn" data-value=${value}>${value}</button>`
          : `<button class="control__btn" data-value=${(value as string[])[0]}>${(value as string[])[1]}</button>`;

      $(element).append(htmlBlock);
    });

    fragment.append(element);
    this.$blockControl.append(fragment);

    this.$btnControl = this.$selector.find('.control button');
  }

  // формирование карточек
  private _cardsRender(options: IModelOptions) {
    const { resultArray, currentNumberOfCards, setType } = options;
    const fragment = document.createDocumentFragment();
    let htmlBlock: string;

    this.savedStatObj['loadingContent'] = true;

    for (let index = 0; index < Number(currentNumberOfCards); index++) {
      if (setType === 'colors') {
        htmlBlock = `<span class="card__face card__face_front"></span><span class="card__face card__face_back" style="background-color:#${resultArray[index]}"></span>`;
      } else {
        htmlBlock = `<span class="card__face card__face_front"></span><span class="card__face card__face_back">${resultArray[index]}</span>`;
      }

      const element = document.createElement('button');
      $(element).addClass('card').data('value', `${resultArray[index]}`).html(htmlBlock);

      fragment.append(element);
    }

    $('.loading')
      .fadeIn()
      .fadeOut(() => {
        this.$cardsWrapper.css('display', 'none').append(fragment).fadeIn(800);
        this.savedStatObj['loadingContent'] = false;
        this._setBestTime(options);
        this.$cards = this.$selector.find('.card');
      });
  }

  private _getSelectors() {
    this.$selector = $('#memory-game');
    this.$blockControl = this.$selector.find('.control');
    this.$cardsWrapper = this.$selector.find('.memory__wrapper');
    this.$resultMinuts = this.$selector.find('.result__minuts');
    this.$resultSeconds = this.$selector.find('.result__seconds');
    this.$elemSeconds = this.$selector.find('.time__seconds');
    this.$elemMinutes = this.$selector.find('.time__minutes');
    this.$elemTimeReset = this.$selector.find('.time__reset');
    this.$elemWithResultTime = this.$selector.find('.time__digital');
  }

  // подсветка выбранного типа
  private _setActiveType(options: IModelOptions, prop: string) {
    this.$btnControl.each((_, elem) => {
      if (elem.dataset['value'] === options[prop]) elem.classList.add('control__btn_active');
    });
  }

  // метод для установки лучшего результата
  private _setBestTime(options: IModelOptions) {
    const { currentBestTime } = options;

    if (currentBestTime) {
      this.$resultMinuts.text(currentBestTime.slice(0, 2));
      this.$resultSeconds.text(currentBestTime.slice(2, 4));
    } else {
      this.$resultMinuts.text('-');
      this.$resultSeconds.text('-');
    }
  }

  // методы для работы с таймером
  private _endTimer() {
    clearInterval(this.savedStatObj['timerID'] as NodeJS.Timeout);
    this.savedStatObj['allowInitTimer'] = true;
    this.$elemSeconds.text('00');
    this.$elemMinutes.text('00');
  }

  private _startTimer() {
    let seconds = Number(this.$elemSeconds.text());
    let minutes = Number(this.$elemMinutes.text());

    seconds += 1;
    this.$elemSeconds.text(seconds < 10 ? `0${seconds}` : seconds);

    if (seconds === 60) {
      minutes += 1;
      this.$elemSeconds.text('00');
      this.$elemMinutes.text(minutes < 10 ? `0${minutes}` : minutes);
    }
  }

  // проверить/установить лучшее время прохождения игры
  private _checkResultTime(options: IModelOptions) {
    const { currentBestTime, setType, currentNumberOfCards } = options;
    const resultTime = this.$elemWithResultTime.text();
    const bestTime = Number(currentBestTime);

    if (bestTime === 0 || bestTime > Number(resultTime)) {
      localStorage.setItem(`${setType}-${currentNumberOfCards}`, resultTime);
    }
  }

  // открытие/закрытие карточек
  private _checkThisCard(classDisabled = '') {
    this.$cards.addClass('not-click');

    setTimeout(() => {
      const flippedElem = $('.is-flipped');
      flippedElem.removeClass('is-flipped').addClass(classDisabled);

      if (classDisabled !== '') flippedElem.attr('tabindex', -1);

      this.$cards.removeClass('not-click');
    }, 800);
  }

  // удаление всех карточек
  private _cardsRemove() {
    this.$cards.remove();
  }

  // переключение и сравнение карточек с запуском таймера
  private _handleCheckingCards(options: IModelOptions, event: Event) {
    event.preventDefault();
    const { currentNumberOfCards } = options;
    const { allowInitTimer } = this.savedStatObj;
    const $target = $(event.target as HTMLButtonElement);

    const canSelectWithTab = $target.hasClass('card') && !$target.hasClass('disabled');

    if ($target.parent().hasClass('card') || canSelectWithTab) {
      if (allowInitTimer) {
        const initTimer = setInterval(() => {
          this._startTimer();
        }, 1000);

        this.savedStatObj['timerID'] = initTimer;
        this.savedStatObj['allowInitTimer'] = false;
      }

      let $flippedCard = $('.is-flipped');

      if ($('.is-flipped').length < 2) {
        if ($target.hasClass('card')) {
          $target.toggleClass('is-flipped');
        } else {
          $target.parent().toggleClass('is-flipped');
        }

        $flippedCard = $('.is-flipped');
      }

      if (
        $flippedCard.length === 2 &&
        $flippedCard.eq(0).data('value') !== $flippedCard.eq(1).data('value')
      ) {
        this._checkThisCard();
      } else if (
        $flippedCard.length === 2 &&
        $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')
      ) {
        this._checkThisCard('disabled');
      }

      if ($('.disabled').length + 2 === Number(currentNumberOfCards) && $flippedCard.length === 2) {
        clearInterval(this.savedStatObj['timerID'] as NodeJS.Timeout);
        this.savedStatObj['allowInitTimer'] = true;
        this._checkResultTime(options);
      }
    }
  }

  // сброс таймера
  private _handleResetTimer() {
    const { loadingContent } = this.savedStatObj;

    if (!loadingContent) {
      this._cardsRemove();
      this._endTimer();
      this.resetCardsEvent.notify();
    }
  }

  // обработка кликов по панели с выборами сложности и типа игры
  private _handleBtnControlClick(event: Event) {
    event.preventDefault();
    const { loadingContent } = this.savedStatObj;
    const $target = $(event.target as HTMLButtonElement);

    if (!$target.hasClass('control__btn_active') && !loadingContent) {
      const $allBtnsControl = $target.parent().children();

      $allBtnsControl.removeClass('control__btn_active');
      $target.addClass('control__btn_active');
      this._cardsRemove();
      this._endTimer();

      if ($target.parent().hasClass('type')) {
        this.setTypeEvent.notify($target.data('value'));
      }

      if ($target.parent().hasClass('difficulty')) {
        this.setCurrentNumberOfCardsEvent.notify($target.data('value'));
      }
    }
  }

  private _setEvents(options: IModelOptions) {
    this.$elemTimeReset.on('click', this._handleResetTimer.bind(this));
    this.$btnControl.on('click', this._handleBtnControlClick.bind(this));
    this.$cardsWrapper.on('click', this._handleCheckingCards.bind(this, options));
  }
}

export default View;
