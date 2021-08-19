import $ from 'jquery';
import Presenter from './presenter';

class ViewCardsBlock {
  $cardsWrapper = $('.memory__wrapper');
  $cards = $('.card');
  presenter: any;

  constructor() {
    this.presenter = null;
  }

  registerWith(presenter: Presenter) {
    this.presenter = presenter;
  }

  init() {
    this.cardsRender(this.presenter.getType());
  }

  // открытие/закрытие карточек
  checkThisCard(classDisabled = '') {
    this.$cards = $('.card');

    this.$cards.addClass('not-click');
    setTimeout(() => {
      const flippedElem = $('.is-flipped');
      flippedElem.removeClass('is-flipped').addClass(classDisabled);

      if (classDisabled !== '') flippedElem.attr('tabindex', -1);

      this.$cards.removeClass('not-click');
    }, 800);
  }

  initCheckingCards(handler: () => void): void {
    this.$cardsWrapper = $('.memory__wrapper');
    this.$cardsWrapper.on('click', handler);
  }

  // формирование карточек
  cardsRender(currentType: string) {
    this.presenter.setLoadingStatus(true);
    const arrayResult = this.presenter.returnArrayShuffle(currentType);
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < this.presenter.getQuantityCards(); index++) {
      const element = document.createElement('button');
      const html = (currentType === 'colors') ? `<span class="card__face card__face_front"></span><span class="card__face card__face_back" style="background-color:#${arrayResult[index]}"></span>` : `<span class="card__face card__face_front"></span><span class="card__face card__face_back">${arrayResult[index]}</span>`;

      $(element).addClass('card')
        .data('value', `${arrayResult[index]}`)
        .html(html);

      fragment.append(element);
    }

    $('.loading').fadeIn().fadeOut(() => {
      this.$cardsWrapper.css('display', 'none').append(fragment).fadeIn(800);
      this.presenter.setLoadingStatus(false);
      this.presenter.setBestTime();
    });
  }

  // удаление всех карточек
  cardsRemove() {
    this.$cards = $('.card');
    this.$cards.remove();
  }

  // переключение и сравнение карточек с запуском таймера
  handleCheckingCards(event: any) {
    event.preventDefault();

    const canSelectWithTab = ($(event.target).hasClass('card') && !$(event.target).hasClass('disabled'));

    if ($(event.target).parent().hasClass('card') || canSelectWithTab) {
      if (this.presenter.getStatusInitTimer()) {
        const initTimer = setInterval(() => {
          this.presenter.startTimer();
        }, 1000);

        this.presenter.setTimerID(initTimer);
        this.presenter.setStatusInitTimer(false);
      }

      let $flippedCard = $('.is-flipped');

      if ($('.is-flipped').length < 2) {
        if ($(event.target).hasClass('card')) {
          $(event.target).toggleClass('is-flipped');
        } else {
          $(event.target).parent().toggleClass('is-flipped');
        }

        $flippedCard = $('.is-flipped');
      }

      if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') !== $flippedCard.eq(1).data('value')) {
        this.checkThisCard();
      } else if ($flippedCard.length === 2 && $flippedCard.eq(0).data('value') === $flippedCard.eq(1).data('value')) {
        this.checkThisCard('disabled');
      }

      if ($('.disabled').length + 2 === this.presenter.getQuantityCards() && $flippedCard.length === 2) {
        clearInterval(this.presenter.getTimerID());
        this.presenter.setStatusInitTimer(true);
        this.presenter.checkResultTime();
      }
    }
  }
}

export default ViewCardsBlock;
