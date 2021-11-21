const body = document.querySelector('body');
const productsPanel = document.querySelector('div.home-product');
const addProductButton = document.querySelector('div.purchase-order.same-info-account span');
const modifyProductButton = document.querySelector('div.user-account-notify.same-info-account span');
const deleteProductButton = document.querySelector('div.user-account-voucher.same-info-account span');
const closeButton = document.querySelector('.close-button');
const popup = document.querySelector('.popup');
const popupButton = document.querySelector('.popup button');
const h1Popup = document.querySelector('.popup h1');
const overlayBack = document.querySelector('#overlay-back');
const productSelecter = document.querySelector('#div-product-selecter');

function addProduct(data) { //take the element in data array then add into productsPanel
    data.forEach(element => {
        let product = document.createElement('div');
        product.classList.add('grid-column-new2');
        let productLink = document.createElement('a');
        productLink.classList.add('home-product-item');
        let img = document.createElement('div');
        img.classList.add('product-item-img');
        let productTitle = document.createElement('h4');
        productTitle.classList.add('product-item-name');
        let productPrice = document.createElement('div');
        productPrice.classList.add('product-item-price');
        let productPriceText = document.createElement('span');
        productPriceText.classList.add('product-item-price-current');

        productLink.setAttribute('href', `/products/${element.id}`);
        img.style.backgroundImage = `url(${element.product_photo})`;
        productTitle.innerText = element.product_name;
        productPriceText.innerText = element.product_price;

        productPrice.append(productPriceText);
        productLink.append(img, productTitle, productPrice);
        product.append(productLink);
        productsPanel.firstElementChild.append(product);
    });
}

function deleteAllProduct() { //delete all products in productsPanel
    for (let i = 0; i < productsPanel.firstElementChild.childNodes.length; i++) {
        productsPanel.firstElementChild.removeChild(productsPanel.firstElementChild.childNodes[i]);
        i--;
    }
}

window.addEventListener('load', async () => {
    try {
        const id = window.location.pathname.slice(14);
        const productsResponse = await axios.get(`/products?provider=${id}`);
        addProduct(productsResponse.data);

    } catch (error) {
        console.log(error);
    }
});

addProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Thêm';
    h1Popup.innerText = 'Thêm sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
});
modifyProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Sửa';
    productSelecter.style.visibility = 'visible';
    h1Popup.innerText = 'Sửa sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
});
deleteProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Xóa';
    productSelecter.style.visibility = 'visible';
    h1Popup.innerText = 'Xóa sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
});

closeButton.addEventListener('click', () => {
    popup.style.visibility = 'hidden';
    overlayBack.style.visibility = 'hidden';
    productSelecter.style.visibility = 'hidden';
});