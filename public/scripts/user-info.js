const usernameContainer1 = document.querySelector('div.user-login-name');
const usernameContainer2 = document.querySelector('div.user-info-name');
const logo = document.querySelector('div.header__logo');
const cartPanel = document.querySelector('ul.cart__list-item');

function addCart(data) {
    data.forEach(async (e) => {
        const ProductsResponse = await axios.get(`/products?id=${e.product_id}`);

        let li = document.createElement('li');
        li.classList.add('cart__item');
        let img = document.createElement('img');
        img.classList.add('cart__list-img');
        let divHead = document.createElement('div');
        divHead.classList.add('card__item-head');
        let h5 = document.createElement('h5');
        let divPrice = document.createElement('div');
        divPrice.classList.add('cart__item-allprice');
        let price = document.createElement('span');
        price.classList.add('cart__item-price');
        let x = document.createElement('span');
        x.classList.add('cart__item-multiply');
        let quantity = document.createElement('span');
        quantity.classList.add('cart__item-quantity');

        img.src = ProductsResponse.data.product_photo;
        h5.innerText = ProductsResponse.data.product_name;
        price.innerText = ProductsResponse.data.product_price;
        quantity.innerText = e.quantity;
        x.innerText = 'x';

        divPrice.append(price, x, quantity);
        divHead.append(h5, divPrice);
        li.append(img, divHead);
        cartPanel.append(li);
    })
}

window.addEventListener('load', async () => {
    try {
        const id = window.location.pathname.slice(6);
        const userResponse = await axios.get(`/user?id=${id}`);
        const userResponseSession = await axios.get('/user');

        if (userResponseSession.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponseSession.data.user_id}`);
            addCart(cartResponse.data);
        }

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
logo.firstElementChild.setAttribute('href', '/');