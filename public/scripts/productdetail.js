const imgContainer = document.querySelector('a.home-product');
const supplierContainer = document.querySelector('div.product-view-sa-supplier');
const priceContainer = document.querySelector('span.book-item-price-current');
const productInfoContainer = document.querySelectorAll('div.book-info-content h6');
const productInfoDescription = document.querySelector('div.book-info-content p');
const logo = document.querySelector('div.header__logo');
const cartPanel = document.querySelector('ul.cart__list-item');
const quantityContainer = document.querySelector('.product-view-sa-author span');
const addQtyButton = document.querySelector('.btn-add-qty');
const subQtyButton = document.querySelector('.btn-subtract-qty');
const Qty = document.querySelector('.qty');
const addCartButton = document.querySelector('.btn-cart-to-cart');

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

function deleteAllCart() {
    for (let i = 0; i < cartPanel.childNodes.length; i++) {
        cartPanel.removeChild(cartPanel.childNodes[i]);
        i--;
    }
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
        let productName = document.querySelector('.book-heading');
        productName.innerText = product.data.product_name;
        productPhoto.classList.add('product-img');
        // sua anh
        productPhoto.style.backgroundImage = `url(${product.data.product_photo})`;
        imgContainer.append(productPhoto);

        productSupplier.innerText = user.data.user_name;
        supplierContainer.appendChild(productSupplier);

        quantityContainer.innerText = quantityContainer.innerText + " " + product.data.quantity;

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

addQtyButton.addEventListener('click', () => {
    Qty.value++;
})

subQtyButton.addEventListener('click', () => {
    Qty.value--;
})

addCartButton.addEventListener('click', async () => {
    const id = window.location.pathname.slice(10);
    try {
        const data = await axios.post(`/products/${id}`, {
            quantity: Qty.value
        });
    } catch (error) {
        console.log(error);
    };

    const userResponse = await axios.get('/user');
    if (userResponse.data.user_id) {
        const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
        deleteAllCart();
        addCart(cartResponse.data);
    }
})

logo.firstElementChild.setAttribute('href', '/');