const usernameContainer1 = document.querySelector('div.user-login-name');
const usernameContainer2 = document.querySelector('div.user-info-name');

window.addEventListener('load', async () => {
    try {
        const id = window.location.pathname.slice(6);
        const userResponse = await axios.get(`/user?id=${id}`);

        let usernameDiv1 = document.createElement('div');
        let usernameDiv2 = document.createElement('p');
        usernameDiv1.innerText = userResponse.data.user_name;
        usernameDiv2.innerText = userResponse.data.user_name;
        usernameContainer1.append(usernameDiv1);
        usernameContainer2.firstElementChild.before(usernameDiv2)
    } catch (error) {
        console.log(error);
    }
});