// добавление стилизации при переключении фокуса с помощью TAB
function checkedFocus() {
  document.body.classList.add('using-mouse');

  const addClassUsingMouse = () => {
    document.body.classList.add('using-mouse');
  };

  const checkingTheTabPress = (e: any) => {
    if (e.key === 'Tab') document.body.classList.remove('using-mouse');
  };

  document.body.addEventListener('mousedown', addClassUsingMouse);
  document.body.addEventListener('keydown', checkingTheTabPress);
}

export default checkedFocus;
