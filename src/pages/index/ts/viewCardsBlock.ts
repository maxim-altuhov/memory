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
      $('.is-flipped').removeClass('is-flipped').addClass(classDisabled);
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
}

export default ViewCardsBlock;
