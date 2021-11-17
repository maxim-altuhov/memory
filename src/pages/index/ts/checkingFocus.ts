// добавление стилизации при переключении фокуса с помощью TAB
function checkingFocus() {
  document.body.classList.add('using-mouse');

  const addClassUsingMouse = () => {
    document.body.classList.add('using-mouse');
  };

  const checkingTheTabPress = (event: Event) => {
    if ((event as KeyboardEvent).code === 'Tab') document.body.classList.remove('using-mouse');
  };

  document.body.addEventListener('mousedown', addClassUsingMouse);
  document.body.addEventListener('keydown', checkingTheTabPress);
}

export default checkingFocus;
