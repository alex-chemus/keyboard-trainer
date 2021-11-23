$(function() {
  $text = $('.text')
  //$typed = $('.typed-text')
  //$rest = $('.rest-text')

  /*fetch('https://litipsum.com/api/1')
    .then(res => res.text())
    .then(data => {
      $text.text(data)
    })
    .then(() => {
      //current character index
      //const currIndex = 0;
      const text = $text.html()
      const after = text.slice(1)
      const char = text.slice(0, 1)
      const content = `<span class="typed"></span><span class="highlight">${char}</span><span class="rest">${after}</span>`

      $text.html(content)

      document.addEventListener('keyup', handleKeyup)
    })*/
  fetchData()
})

const keys = {
  keyWhich: null,
  leftShift: false,
  rightShift: false,
}

const shifts = {
  left: false,
  right: false,
}

document.querySelector('.success button').addEventListener('click', () => {
  window.location.reload()
})

//фетчится дата, если набор символов некорректен,
//то функция рекурсивно вызывается
function fetchData() {
  fetch('https://litipsum.com/api/1')
    .then(res => res.text())
    .then(data => {
      console.log(data)
      if (dataIsValid(data)) {
        appendText($text, data)
      } else {
        fetchData()
      }
     })
}

//проверка на валидность текста
function dataIsValid(data) {
  const regex = /[\sa-zA-Z0-9=[\]:;'",.?/!-]+/gi
  //console.log('data validation: ', regex.test(data))
  return regex.test(data)
}

// вставляет текст в html
function appendText($text, data) {
  $text.text(data)
  const text = $text.html()
  const after = text.slice(1)
  const char = text.slice(0, 1)
  const content = `<span class="typed"></span><span class="highlight-text">${char}</span><span class="rest">${after}</span>`
  
  selectKeys(char)
  $text.html(content)

  document.addEventListener('keydown', registerShifts)
  document.addEventListener('keyup', handleKeyup)
}

// регистрирует нажатие на шифт
function registerShifts(event) {
  if (event.code == 'ShiftLeft') {
    shifts.left = true
  }
  if (event.code == 'ShiftRight') {
    shifts.right = true
  }
}

// хэндлит кейап
function handleKeyup(event) {
  // снимает флаги с соответствующих шифтов при их keyup
  if (event.code == 'ShiftLeft') {
    shifts.left = false
  }
  if (event.code == 'ShiftRight') {
    shifts.right = false
  }

  const $typed = $('.typed') 
  const $rest = $('.rest')
  const $highlight = $('.highlight-text')

  // закончить тренинг
  if (!$rest.html().length) {
    $('.text-container, .keyboard').css('display', 'none')
    $('.success').css('display', 'block')
  }

  // валидация правильности нажатия 
  if (event.which != keys.keyWhich 
    || keys.leftShift != shifts.left
    || keys.rightShift != shifts.right) {
      console.log(keys)
      console.log(shifts)
      return
  }  

  // махинации с контентом в html
  $typed.html($typed.html() + $highlight.html())
  $highlight.html($rest.html()[0])
  $rest.html( $rest.html().slice(1) )

  // отмена предыдущие выделения и ставит новые
  removeSelect()
  selectKeys($highlight.html())

  // смещает html-элемент при печати (aka скрол)
  const shift = Math.floor($typed.html().length / 80)
  $text.css('top', `calc(1.5rem * 1.7 * ${-shift})`)
}
 
// удаляет селект, основываясь на глобальном скоупе
function removeSelect() {
  $('.row').children().each(function() {
    $(this).removeClass('highlight-key')
  })

  keys.rightShift = false
  keys.leftShift = false
}

// функция выделает элементы,создаёт в глобальном масссив с клавишами
// для выделения и валидации
function selectKeys(char) {
  $('.row').children().each(function() {
    // проверка на знаки и числа
    if ( $(this).html().toLowerCase() == char.toLowerCase() ) {
      const $key = $(this)
      const which = $key.attr('data-which')
      keys.keyWhich = which
      $key.addClass('highlight-key')

      // устанавливает флаги для левого и правого шифта
      if ( /^[A-Z]$/.test(char) ) {
        // клавиши слева -> шифт справа
        if ( ['Q', 'A', 'Z', 'W', 'S', 'X', 'E', 'D', 'C', 'R',
        'F', 'V', 'T', 'G', 'B'].includes(char) ) {
          keys.rightShift = true
          $('.right-shift').addClass('highlight-key')
        } else {
          // клавиши справа -> шифт слева
          keys.leftShift = true
          $('.left-shift').addClass('highlight-key')
        }
      }
    }

    // проверка на кавычки
    if ( /^["“'”’]$/.test(char) && $(this).html()==="'" ) {
      const $key = $(this)
      const which = $key.attr('data-which')
      keys.keyWhich = which

      $key.addClass('highlight-key')

      if (/^["“”]$/.test(char)) {
        keys.leftShift = true
        $('.left-shift').addClass('highlight-key')
      }
    }

    // проверка на пробел
    if ( $(this).hasClass('space') && char==' ' ) {
      const $key = $(this)
      const which = $key.attr('data-which')
      keys.keyWhich = which

      $key.addClass('highlight-key')
    }

    // проверка на апостроф
    if ( char==='`' && $(this).html()==='`' ) {
      const $key = $(this)
      const which = $key.attr('data-which')
      keys.keyWhich = which

      $key.addClass('highlight-key')
    }
  })
}