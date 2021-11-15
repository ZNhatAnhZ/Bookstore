const searchButton = document.querySelector('button.header__search-btn');
const searchBar = document.querySelector('input.header__search-input');
const body = document.querySelector('body');
const productsPanel = document.querySelector('div.home-product');
const categoriesPanel = document.querySelector('ul.category-list');

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

window.addEventListener('load', () => {
    axios.get('/products')
        .then((res) => {
            let data = [];
            data = res.data;
            addProduct(data);
            axios.get('/categories')
                .then((res) => {
                    let categories = [];
                    categories = res.data;
                    addCategory(categories);
                })
                .catch((error) => {
                    console.log(error);
                });
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

            deleteAllCategory(); //delete category to add new category from search
            let categories = [];
            data.forEach((e) => {
                let temp = true;
                categories.forEach((cate) => {
                    if (cate === e.product_category) temp = false;
                })
                if (temp) {
                    categories.push(e.product_category);
                }
            })
            categories.forEach((e) => {
                axios.get(`/categories/${e}`)
                    .then((res) => {
                        console.log(res.data);
                        addCategory(res.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
        })
        .catch((error) => {
            console.log(error);
        });
});