$(function() {
    $text = $('.text')
    //$typed = $('.typed-text')
    //$rest = $('.rest-text')

    fetch('https://litipsum.com/api')
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
    })
})

function handleKeyup(event) {
    const $typed = $('.typed') 
    const $rest = $('.rest')
    const $highlight = $('.highlight')
    $typed.html($typed.html() + $highlight.html())

    $highlight.html($rest.html()[0])
    $rest.html( $rest.html().slice(1) )

    //shift text elemen (aka scroll)
    const shift = Math.floor($typed.html().length / 80)
    console.log(shift)
    $text.css('top', `calc(1.5rem * 1.7 * ${-shift})`)
}