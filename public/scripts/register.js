const userInput = document.querySelectorAll('input');
const logo = document.querySelector('div.head__logo');
const gobackbtn = document.querySelector('button.signup-form-goback');
logo.firstElementChild.setAttribute('href', '/');

gobackbtn.addEventListener('click', () => {
    const form = document.querySelector('form');
    form.addEventListener('click', (e) => {
        e.preventDefault();
    })
    window.location = '/';
})

