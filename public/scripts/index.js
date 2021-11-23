const searchButton = document.querySelector('button.header__search-btn');
const searchBar = document.querySelector('input.header__search-input');
const body = document.querySelector('body');
const productsPanel = document.querySelector('div.home-product');
const categoriesPanel = document.querySelector('ul.category-list');
const cartPanel = document.querySelector('ul.cart__list-item');

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

function addCategory(data) {
    data.forEach((e) => {
        let link = document.createElement('a');
        let list = document.createElement('li');

        list.classList.add('category-item');
        link.setAttribute('href', '');
        link.classList.add('category-item-link');

        link.innerText = e.category_name;

        list.append(link);
        categoriesPanel.append(list);
    })
}

function deleteAllCategory() {
    for (let i = 0; i < categoriesPanel.childNodes.length; i++) {
        categoriesPanel.removeChild(categoriesPanel.childNodes[i]);
        i--;
    }
}

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
        const productsResponse = await axios.get('/products');
        const categoriesResponse = await axios.get('/categories');
        const userResponse = await axios.get('/user');

        if (userResponse.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
            addCart(cartResponse.data);
        }
        addProduct(productsResponse.data);
        addCategory(categoriesResponse.data);
    } catch (error) {
        console.log(error);
    }
});

searchButton.addEventListener('click', async () => {
    try {
        const findProductsResponse = await axios.get(`/products?title=${searchBar.value}`);
        const products = findProductsResponse.data;
        deleteAllProduct();
        deleteAllCategory();
        addProduct(products)
        const categories = [];

        products.forEach((e) => {
            let temp = true;
            categories.forEach((cate) => {
                if (cate === e.product_category) temp = false;
            })
            if (temp) {
                categories.push(e.product_category);
            }
        })

        categories.forEach(async (e) => {
            const categoriesResponse = await axios.get(`/categories?id=${e}`);
            addCategory(categoriesResponse.data);
        })
    } catch (error) {
        console.log(error);
    }
});

searchBar.addEventListener('keyup', async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        try {
            const findProductsResponse = await axios.get(`/products?title=${searchBar.value}`);
            const products = findProductsResponse.data;
            deleteAllProduct();
            deleteAllCategory();
            addProduct(products)
            const categories = [];

            products.forEach((e) => {
                let temp = true;
                categories.forEach((cate) => {
                    if (cate === e.product_category) temp = false;
                })
                if (temp) {
                    categories.push(e.product_category);
                }
            })

            categories.forEach(async (e) => {
                const categoriesResponse = await axios.get(`/categories?id=${e}`);
                addCategory(categoriesResponse.data);
            })
        } catch (error) {
            console.log(error);
        }
    }
});
