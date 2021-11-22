const imgContainer = document.querySelector('a.home-product');
const supplierContainer = document.querySelector('div.product-view-sa-supplier');
const priceContainer = document.querySelector('span.book-item-price-current');
const productInfoContainer = document.querySelectorAll('div.book-info-content h6');
const productInfoDescription = document.querySelector('div.book-info-content p');
const logo = document.querySelector('div.header__logo');



window.addEventListener('load', async () => {
    try {
        const id = window.location.pathname.slice(10);
        const product = await axios.get(`/products?id=${id}`);
        const user = await axios.get(`/user?id=${product.data.provider_id}`);
        const category = await axios.get(`/categories?id=${product.data.product_category}`);

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