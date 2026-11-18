import './assets/styles/style.sass'
import './assets/styles/tailwind.css'

const burgers = document.querySelectorAll('.burger')
const navs = document.querySelectorAll('.navigation')
const overlay = document.querySelector('.overlay')
const closeButtons = document.querySelectorAll('.x')
const navLinks = document.querySelectorAll('.navigation a')

function closeMenu() {
    navs.forEach(nav => nav.classList.remove('active'))
    overlay?.classList.remove('active')
    document.body.classList.remove('lock')

    burgers.forEach(burger => {
        burger.setAttribute('aria-expanded', 'false')
    })
}

burgers.forEach((burger, index) => {
    burger.addEventListener('click', () => {
        const nav = navs[index]

        if (!nav || !overlay) return

        const isOpen = nav.classList.contains('active')

        closeMenu()

        if (!isOpen) {
            nav.classList.add('active')
            overlay.classList.add('active')
            document.body.classList.add('lock')
            burger.setAttribute('aria-expanded', 'true')
        }
    })
})

overlay?.addEventListener('click', closeMenu)

closeButtons.forEach(button => {
    button.addEventListener('click', closeMenu)
})

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu)
})

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu()
})