const imgContainer = document.querySelector('a.home-product');
const supplierContainer = document.querySelector('div.product-view-sa-supplier');
const priceContainer = document.querySelector('span.book-item-price-current');
const priceOld = document.querySelector('span.book-item-price-old');
const productInfoContainer = document.querySelectorAll('div.book-info-content h6');
const productInfoDescription = document.querySelector('div.book-info-content p');
const logo = document.querySelector('div.header__logo');
const cartPanel = document.querySelector('ul.cart__list-item');
const quantityContainer = document.querySelector('.product-view-sa-author span');
const addQtyButton = document.querySelector('.btn-add-qty');
const subQtyButton = document.querySelector('.btn-subtract-qty');
const Qty = document.querySelector('.qty');
const addCartButton = document.querySelector('.btn-cart-to-cart');
let headerCartNumber = document.querySelector('span.header__cart-number');
headerCartNumber.innerText = 0;

let headerCartList = document.querySelector('div.header__cart-list');
// xem gio hang
let cartFoot = document.createElement('div');
cartFoot.classList.add('cart__foot');
let cartItemBtn = document.createElement('button');
cartItemBtn.classList.add('cart__item-btn');
cartItemBtn.innerText = 'Xem giỏ hàng';
cartFoot.append(cartItemBtn);
cartItemBtn.addEventListener('click', async () => {
    const userResponse = await axios.get('/user');
    window.location = `/cart/${userResponse.data.user_id}`;
});


//hien thong bao mua
const aleartx = document.querySelector('div.aleart-notify');
const aleartSuccess = document.createElement('div');
aleartSuccess.classList.add('aleart-success');
aleartSuccess.innerHTML = `
            <div class="aleart-success-icon">
                <i class="fa fa-check-circle" aria-hidden="false"></i>
            </div>
            <div class="aleart-success-text">
                Sản phẩm đã được thêm vào giỏ hàng
            </div>
            `;
const buySuccess = document.createElement('div');
buySuccess.classList.add('aleart-success');
buySuccess.innerHTML = `
            <div class="aleart-success-icon">
                 <i class="fa fa-check-circle" aria-hidden="false"></i>
            </div>
                <div class="aleart-success-text">
                    Bạn đã mua sản phẩm thành công
                </div>
            `;

const buyNowButton = document.querySelector('.btn-buy-now');
const addCommentButton = document.querySelector('.add-comment');
const commentInput = document.querySelector('.form-control');
const commentPanel = document.querySelector('#commentPanel');

function cartAddItemsNotification() {


}

function loadComment(data) {
    data.forEach(async (e) => {
        const userResponse = await axios.get(`/user?id=${e.review_by}`);

        let Div = document.createElement('div');

        let userDiv = document.createElement('div');
        userDiv.classList.add('box');
        let userAvtDiv = document.createElement('div');
        userAvtDiv.classList.add('box');
        userAvtDiv.style.float = 'left';
        let userAvt = document.createElement('img');
        userAvt.src = 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png';
        userAvt.style.height = '30px';
        userAvt.style.width = '30px';

        userAvtDiv.append(userAvt);

        let userNameDiv = document.createElement('div');
        userNameDiv.classList.add('box');
        userNameDiv.style.marginLeft = '40px';
        let userName = document.createElement('h5');
        userName.innerText = userResponse.data.user_name;

        userNameDiv.append(userName);
        userDiv.append(userAvtDiv, userNameDiv);

        let commentDiv = document.createElement('div');
        commentDiv.classList.add('box');
        commentDiv.style.paddingLeft = '40px';
        commentDiv.style.width = '50%';
        let commentDate = document.createElement('h6');
        commentDate.innerText = e.review_date;
        let comment = document.createElement('p');
        comment.innerText = e.comment;

        commentDiv.append(commentDate, comment);
        let linebreak = document.createElement('br');

        Div.append(userDiv, commentDiv, linebreak);
        commentPanel.append(Div);
    })
}

function addCart(data) {
    let countProduct = 0;
    data.forEach(async (e) => {
        countProduct++;
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
    headerCartNumber.innerText = countProduct;
    headerCartList.append(cartFoot);
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
        const commentResponse = await axios.get(`/products/comment/${id}`);

        let productPhoto = document.createElement('div');
        let productSupplier = document.createElement('span');
        let productName = document.querySelector('.book-heading');
        let productID = document.querySelector('.product-id');
        productID.innerHTML = 'Mã hàng ' + product.data.id;
        productName.innerText = product.data.product_name;
        productPhoto.classList.add('product-img');
        productPhoto.style.backgroundImage = `url(${product.data.product_photo})`;
        imgContainer.append(productPhoto);

        productSupplier.innerText = user.data.user_name;
        supplierContainer.appendChild(productSupplier);

        quantityContainer.innerText = quantityContainer.innerText + " " + product.data.quantity;

        priceContainer.innerText = product.data.product_price + 'đ';
        priceOld.innerText = product.data.product_price * 1.5 + 'đ';
        productInfoContainer[0].innerText += product.data.id;
        productInfoContainer[1].innerText += user.data.user_name;
        category.data.forEach((e) => {
            productInfoContainer[2].innerText += e.category_name;
        })
        productInfoDescription.innerText = product.data.product_details;

        if (userResponse.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
            const getRecommendedProduct = await axios.get(`/products/recommendedproducts/${userResponse.data.user_id}`);
            addCart(cartResponse.data);
            console.log(getRecommendedProduct.data);
            addRecommendedProducts(getRecommendedProduct.data);
        }

        loadComment(commentResponse.data);
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
    const userResponse = await axios.get('/user');
    const id = window.location.pathname.slice(10);
    if (userResponse.data.user_id) {
        try {
            const data = await axios.post(`/products/${id}`, {
                quantity: Qty.value
            });

        } catch (error) {
            console.log(error);
        };
        const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
        deleteAllCart();
        addCart(cartResponse.data);
    } else {
        window.location = `/login?origin=/products/${id}`;
    }
    aleartx.append(aleartSuccess);

    setTimeout(function () {
        aleartx.removeChild(aleartSuccess);
    }, 3000)
})

buyNowButton.addEventListener('click', async () => {
    const userResponse = await axios.get('/user');
    const id = window.location.pathname.slice(10);
    if (userResponse.data.user_id) {
        try {
            const data = await axios.post(`/products/buy/${id}`, {
                quantity: Qty.value
            });
        } catch (error) {
            console.log(error);
        };
    } else {
        window.location = `/login?origin=/products/${id}`;
    }

    aleartx.append(buySuccess);

    setTimeout(function () {
        aleartx.removeChild(buySuccess);
    }, 3000)
})

addCommentButton.parentElement.addEventListener('submit', (e) => {
    e.preventDefault();
})

addCommentButton.addEventListener('click', async () => {
    const userResponse = await axios.get('/user');
    const id = window.location.pathname.slice(10);
    if (userResponse.data.user_id) {
        try {
            const data = await axios.post(`/products/comment/${id}`, {
                comment: commentInput.value
            });
        } catch (error) {
            console.log(error);
        };
        window.location = `/products/${id}`;
    } else {
        window.location = `/login?origin=/products/${id}`;
    }
})

logo.firstElementChild.setAttribute('href', '/');


function addRecommendedProducts(data) {
    const recommendedProductsPanel = document.querySelector('div.grid__row.gird__row-limit');
    data.forEach((element) => {
        let product = document.createElement('div');
        product.classList.add('grid-column-2');
        let productLink = document.createElement('a');
        productLink.classList.add('home-product-item');
        let img = document.createElement('div');
        img.classList.add('product-item-img');
        let productTitle = document.createElement('h4');
        productTitle.classList.add('product-item-name');
        //price
        let productPrice = document.createElement('div');
        productPrice.classList.add('product-item-price');
        let productPriceText = document.createElement('span');
        let productOldPrice = document.createElement('span');
        //rating
        let productItemRating = document.createElement('div');
        let productRatingHeart = document.createElement('span');
        productRatingHeart.classList.add('rating-heart');
        let itemHeart = document.createElement('i');
        itemHeart.classList.add('fa');
        itemHeart.classList.add('fa-heart-o');
        let productRatingStar = document.createElement('span');
        productRatingStar.classList.add('rating-star');
        let itemStar = document.createElement('i');
        itemStar.classList.add('fa');
        itemStar.classList.add('fa-star');
        let itemStar1 = document.createElement('i');
        itemStar1.classList.add('fa');
        itemStar1.classList.add('fa-star');
        let itemStar2 = document.createElement('i');
        itemStar2.classList.add('fa');
        itemStar2.classList.add('fa-star');
        let itemStar3 = document.createElement('i');
        itemStar3.classList.add('fa');
        itemStar3.classList.add('fa-star');
        let itemStar4 = document.createElement('i');
        itemStar4.classList.add('fa');
        itemStar4.classList.add('fa-star');
        let itemStar5 = document.createElement('i');
        itemStar5.classList.add('fa');
        itemStar5.classList.add('fa-star-o');
        let productNumberSold = document.createElement('span');
        productNumberSold.classList.add('rating-number-sold');
        productNumberSold.innerText = 'Số lượng ' + element.quantity;
        //yeu thich
        let productItemFavourite = document.createElement('div');
        productItemFavourite.classList.add('product-item-favourite');
        let itemCheck = document.createElement('i');
        itemCheck.classList.add('fa');
        itemCheck.classList.add('fa-check');
        productItemFavourite.append(itemCheck, 'Yêu thích');

        productItemRating.classList.add('product-item-rating');
        productOldPrice.classList.add('product-item-price-old');
        productPriceText.classList.add('product-item-price-current');
        productLink.setAttribute('href', `/products/${element.id}`);
        img.style.backgroundImage = `url(${element.product_photo})`;
        productTitle.innerText = element.product_name;
        productPriceText.innerText = element.product_price + 'đ';
        productOldPrice.innerText = element.product_price * 1.5 + 'đ';

        productRatingStar.append(itemStar, itemStar1, itemStar2, itemStar3, itemStar4);
        productRatingHeart.append(itemHeart);
        productItemRating.append(productRatingHeart, productRatingStar, productNumberSold);
        productPrice.append(productOldPrice, productPriceText);
        productLink.append(img, productTitle, productPrice, productItemRating, productItemFavourite);
        product.append(productLink);
        recommendedProductsPanel.append(product);
    })
}