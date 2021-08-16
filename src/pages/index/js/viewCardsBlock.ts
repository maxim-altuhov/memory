import $ from 'jquery';
import Presenter from './presenter';

class ViewCardsBlock {
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
      $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
      this.$cards.removeClass('not-click');
    }, 800);
  }

  // переключение и сравнение карточек с запуском таймера
  checkingCards(event: { target: any; }) {
    if (this.presenter.getStatusInitTimer()) {
      const initTimer = setInterval(() => {
        this.presenter.startTimer();
      }, 1000);

      this.presenter.setTimerID(initTimer);
      this.presenter.setStatusInitTimer(false);
    }

    let $flippedCard = $('.is-flipped');

    if ($('.is-flipped').length < 2) {
      $(event.target).parent().toggleClass('is-flipped');
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

  // формирование карточек
  cardsRender(currentType: string) {
    this.presenter.setLoadingStatus(true);
    const arrayResult = this.presenter.returnArrayShuffle(currentType);
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < this.presenter.getQuantityCards(); index++) {
      const element = document.createElement('div');
      const html = (currentType === 'colors') ? `<div class="card__face card__face_front"></div><div class="card__face card__face_back" style="background-color:#${arrayResult[index]}"></div>` : `<div class="card__face card__face_front"></div><div class="card__face card__face_back">${arrayResult[index]}</div>`;

      $(element).addClass('card')
        .data('value', `${arrayResult[index]}`)
        .html(html)
        .on('click', (event) => {
          this.checkingCards(event);
        });

      fragment.append(element);
    }

    $('.loading').fadeIn().fadeOut(() => {
      $('.memory__wrapper').css('display', 'none').append(fragment).fadeIn(800);
      this.presenter.setLoadingStatus(false);
      this.presenter.setBestTime();
    });
  }

  // удаление всех карточек
  cardsRemove() {
    this.$cards = $('.card');
    this.$cards.remove();
  }
}

export default ViewCardsBlock;
