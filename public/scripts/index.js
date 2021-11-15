const searchButton = document.querySelector('button.header__search-btn');
const searchBar = document.querySelector('input.header__search-input');
const body = document.querySelector('body');
const productsPanel = document.querySelector('div.home-product');

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

        productLink.setAttribute('href', '');
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

window.addEventListener('load', () => {
    axios.get('/products')
        .then((res) => {
            let data = [];
            data = res.data;
            addProduct(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

searchButton.addEventListener('click', () => {
    axios.get(`/products/${searchBar.value}`)
        .then((res) => {
            let data = [];
            data = res.data;
            deleteAllProduct();
            addProduct(data)
        })
        .catch((error) => {
            console.log(error);
        });
});