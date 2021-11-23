const imgContainer = document.querySelector('a.home-product');
const supplierContainer = document.querySelector('div.product-view-sa-supplier');
const priceContainer = document.querySelector('span.book-item-price-current');
const productInfoContainer = document.querySelectorAll('div.book-info-content h6');
const productInfoDescription = document.querySelector('div.book-info-content p');
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
        const id = window.location.pathname.slice(10);
        const product = await axios.get(`/products?id=${id}`);
        const user = await axios.get(`/user?id=${product.data.provider_id}`);
        const category = await axios.get(`/categories?id=${product.data.product_category}`);
        const userResponse = await axios.get('/user');
        if (userResponse.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
            addCart(cartResponse.data);
        }

        let productPhoto = document.createElement('div');
        let productSupplier = document.createElement('span');

        productPhoto.classList.add('product-img');
        // sua anh
        productPhoto.style.backgroundImage = `url(product.data.product_photo)`;
        imgContainer.append(productPhoto);

        productSupplier.innerText = user.data.user_name;
        supplierContainer.appendChild(productSupplier);

        priceContainer.innerText = product.data.product_price + 'đ';
        productInfoContainer[0].innerText += product.data.id;
        productInfoContainer[1].innerText += user.data.user_name;
        category.data.forEach((e) => {
            productInfoContainer[2].innerText += e.category_name;
        })
        productInfoDescription.innerText = product.data.product_details;


    } catch (error) {
        console.log(error);
    }
});

logo.firstElementChild.setAttribute('href', '/');