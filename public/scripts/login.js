const userInput = document.querySelectorAll('input');
const logo = document.querySelector('div.head__logo');
const gobackbtn = document.querySelector('button.login-form-goback');
logo.firstElementChild.setAttribute('href', '/');
const loginButton = document.querySelector('button.login-form-login');
const usernameInput = document.querySelector('#usernameInput');
const passwordInput = document.querySelector('#passwordInput');
const alertLogin = document.querySelector('.alertLogin');

loginButton.parentElement.parentElement.parentElement.addEventListener('submit', (e) => {
    e.preventDefault();
})

gobackbtn.addEventListener('click', () => {
    const form = document.querySelector('form');
    form.addEventListener('click', (e) => {
        e.preventDefault();
    })
    window.location = '/';
})

loginButton.addEventListener('click', async () => {
    if (usernameInput.value != "" || passwordInput.value != "") {
        const loginResponse = await axios.post('/login', {
            username: usernameInput.value,
            password: passwordInput.value
        });
        if (loginResponse.data.wrong == "password") {
            alertLogin.innerText = 'sai mật khẩu!';
            alertLogin.style.color = 'rgb(243, 32, 19)';
        } else if (loginResponse.data.wrong == "username") {
            alertLogin.innerText = 'sai tên đăng nhập!';
            alertLogin.style.color = 'rgb(243, 32, 19)';
        } else {
            const link = window.location.href.slice(35);
            if (link != "") {
                window.location = link;
            } else {
                window.location = "/";
            }

        }
    } else {
        alertLogin.innerText = 'sai form!';
        alertLogin.style.color = 'rgb(243, 32, 19)';
    }
})
