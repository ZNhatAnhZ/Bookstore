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
const productSelecterDiv = document.querySelector('#div-product-selecter');

const productSelecter = document.querySelector('#product-selecter');
const categorySelecter = document.querySelector('#popupCategory');
const nameSelecter = document.querySelector('#popupName');
const priceSelecter = document.querySelector('#popupPrice');
const quantitySelecter = document.querySelector('#popupQuantity');
const imgSelecter = document.querySelector('#popupImg');
const textareaSelecter = document.querySelector('#popupTextarea');

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

function popupAddProduct(data) { //add product to the product selector
    data.forEach((e) => {
        let option = document.createElement('option');
        option.value = e.id;
        option.innerText = `${e.id}: ${e.product_name}`;
        productSelecter.append(option);
    })
}

function popupDeleteAllProduct() { //add product to the product selector
    for (let i = 0; i < productSelecter.childNodes.length; i++) {
        productSelecter.removeChild(productSelecter.childNodes[i]);
        i--;
    }
    let option = document.createElement('option');
    option.value = 'none';
    option.innerText = '--Chọn sản phẩm--';
    productSelecter.append(option);
}

function closePopup() {
    popup.style.visibility = 'hidden';
    overlayBack.style.visibility = 'hidden';
    productSelecterDiv.style.visibility = 'hidden';

    categorySelecter.value = '';
    nameSelecter.value = '';
    priceSelecter.value = '';
    quantitySelecter.value = '';
    imgSelecter.value = '';
    textareaSelecter.value = '';

    popupButton.removeEventListener('click', sendProduct);
    popupButton.removeEventListener('click', modifyProduct);
}

async function loadProductPanelAndPopup() {
    try {
        const id = window.location.pathname.slice(14);
        const productsResponse = await axios.get(`/products?provider=${id}`);
        deleteAllProduct();
        popupDeleteAllProduct();
        addProduct(productsResponse.data);
        popupAddProduct(productsResponse.data);

    } catch (error) {
        console.log(error);
    }
}

async function sendProduct() {
    const id = window.location.pathname.slice(14);
    try {
        const data = await axios.post(`/personalshop/${id}`, {
            product_selector: 'none',
            product_category: categorySelecter.value,
            product_name: nameSelecter.value,
            product_price: priceSelecter.value,
            product_quantity: quantitySelecter.value,
            product_img: imgSelecter.value,
            product_description: textareaSelecter.value,
            provider_id: id
        })
    } catch (error) {
        console.log(error);
    }
    await loadProductPanelAndPopup();
    closePopup();
}

async function modifyProduct() {
    const id = window.location.pathname.slice(14);
    try {
        const data = await axios.post(`/personalshop/${id}`, {
            product_selector: productSelecter.value,
            product_category: categorySelecter.value,
            product_name: nameSelecter.value,
            product_price: priceSelecter.value,
            product_quantity: quantitySelecter.value,
            product_img: imgSelecter.value,
            product_description: textareaSelecter.value,
            provider_id: id
        })
    } catch (error) {
        console.log(error);
    }
    await loadProductPanelAndPopup();
    closePopup();
}

async function deleteProduct() {
    const id = window.location.pathname.slice(14);
    try {
        const data = await axios.post(`/personalshop/${id}`, {
            product_selector: productSelecter.value
        })
    } catch (error) {
        console.log(error);
    }
    await loadProductPanelAndPopup();
    closePopup();
}

window.addEventListener('load', loadProductPanelAndPopup);

productSelecter.addEventListener('change', async () => {
    if (productSelecter.value === 'none') {
        categorySelecter.value = '';
        nameSelecter.value = '';
        priceSelecter.value = '';
        quantitySelecter.value = '';
        imgSelecter.value = '';
        textareaSelecter.value = '';
    } else {
        const selectProductsResponse = await axios.get(`/products?id=${productSelecter.value}`);
        const Product = selectProductsResponse.data;
        const selectCategoryResponse = await axios.get(`/categories?id=${Product.product_category}`);
        categorySelecter.value = selectCategoryResponse.data[0].category_name;
        nameSelecter.value = Product.product_name;
        priceSelecter.value = Product.product_price;
        quantitySelecter.value = Product.quantity;
        imgSelecter.value = Product.product_photo;
        textareaSelecter.value = Product.product_details;
    }

})

addProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Thêm';
    h1Popup.innerText = 'Thêm sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
    popupButton.addEventListener('click', sendProduct);
});
modifyProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Sửa';
    productSelecterDiv.style.visibility = 'visible';
    h1Popup.innerText = 'Sửa sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
    popupButton.addEventListener('click', modifyProduct);
});
deleteProductButton.addEventListener('click', () => {
    popupButton.innerText = 'Xóa';
    productSelecterDiv.style.visibility = 'visible';
    h1Popup.innerText = 'Xóa sản phẩm';
    popup.style.visibility = 'visible';
    overlayBack.style.visibility = 'visible';
    popupButton.addEventListener('click', deleteProduct);
});
closeButton.addEventListener('click', closePopup);