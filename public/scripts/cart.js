const mainCartPanel = document.querySelector('div.product-body-main');
const payAllPrice1 = document.querySelector('#pay-all-price');
const payAllPrice2 = document.querySelector('div.pay-all-price');
const buyAllButton = document.querySelector('button.content-buy-btn');
let totalAmount = 0;

//thong bao da mua thanh cong
const aleartx = document.querySelector('div.aleart-notify');
const aleartSuccess = document.createElement('div');
aleartSuccess.classList.add('aleart-success');
aleartSuccess.innerHTML = `
            <div class="aleart-success-icon">
                <i class="fa fa-check-circle" aria-hidden="false"></i>
            </div>
            <div class="aleart-success-text">
                Bạn đã mua hàng thành công !
            </div>
            `;

function deleteAllCartItems() {
    for (let i = 0; i < mainCartPanel.childNodes.length; i++) {
        mainCartPanel.removeChild(mainCartPanel.childNodes[i]);
        i--;
    }
    totalAmount = 0;
    payAllPrice1.innerText = totalAmount + "đ";
    payAllPrice2.innerText = totalAmount + "đ";
}

function addMainCart(data) {
    data.forEach(async (e) => {
        const ProductsResponse = await axios.get(`/products?id=${e.product_id}`);

        const cartId = document.createElement('span');
        cartId.innerText = e.id;
        cartId.style.display = 'none';

        const bodyProduct = document.createElement('div');
        bodyProduct.classList.add('body-main-product');

        const mainBodyImgAndText = document.createElement('div');
        mainBodyImgAndText.classList.add('main-product-imgandtext');
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('product-imgandtext-img');
        const img = document.createElement('img');
        img.src = ProductsResponse.data.product_photo;
        const mainBodyText = document.createElement('div');
        mainBodyText.classList.add('product-imgandtext-text');
        const productName = document.createElement('span');
        productName.innerText = ProductsResponse.data.product_name;
        const productId = document.createElement('span');
        productId.innerText = 'Mã: ' + ProductsResponse.data.id;

        mainBodyText.append(productName, productId);
        imgDiv.append(img);
        mainBodyImgAndText.append(imgDiv, mainBodyText);

        const seeMoreDiv = document.createElement('div');
        seeMoreDiv.classList.add('main-product-seemore');
        const seeMoreButton = document.createElement('button');
        seeMoreButton.classList.add('product-seemore-btn');
        seeMoreButton.addEventListener('click', () => {
            location.href = `/products/${ProductsResponse.data.id}`;
        })

        seeMoreButton.innerText = 'Xem chi tiet >>';
        seeMoreDiv.append(seeMoreButton);

        const productPriceDiv = document.createElement('div');
        productPriceDiv.classList.add('main-product-price');
        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price-current');

        productPrice.innerText = ProductsResponse.data.product_price + "đ";
        productPriceDiv.append(productPrice);

        const productQuantityDiv = document.createElement('div');
        productQuantityDiv.classList.add('main-product-number');
        const productQuantityLabel = document.createElement('label');
        productQuantityLabel.innerText = 'Số lượng: ';
        const productQuantityInput = document.createElement('input');

        productQuantityInput.value = e.quantity;
        productQuantityDiv.append(productQuantityLabel, productQuantityInput);

        const productPriceAllDiv = document.createElement('div');
        productPriceAllDiv.classList.add('main-product-allprice');
        const productPriceAll = document.createElement('span');

        productPriceAll.innerText = e.quantity * ProductsResponse.data.product_price + "đ";
        totalAmount = totalAmount + e.quantity * ProductsResponse.data.product_price;
        productPriceAllDiv.append(productPriceAll);

        const productDeleteDiv = document.createElement('div');
        productDeleteDiv.classList.add('main-product-delete');
        const productDeleteButton = document.createElement('button');
        productDeleteButton.classList.add('product-delete-btn');
        productDeleteButton.addEventListener('click', async () => {
            const id = window.location.pathname.slice(6);
            try {
                const data = await axios.post(`/cart/${id}`, {
                    cart_id: e.id
                })

                const userResponse = await axios.get('/user');
                if (userResponse.data.user_id) {
                    const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
                    deleteAllCartItems();
                    addMainCart(cartResponse.data);
                }
            } catch (error) {
                console.log(error);
            }

        })

        productDeleteButton.innerText = 'Xóa sản phẩm';
        productDeleteDiv.append(productDeleteButton);

        const lineBreak = document.createElement('div');
        lineBreak.classList.add('_2aRlry');

        bodyProduct.append(cartId, mainBodyImgAndText, seeMoreDiv, productPriceDiv, productQuantityDiv, productPriceAllDiv, productDeleteDiv);
        mainCartPanel.append(bodyProduct);



        payAllPrice1.innerText = totalAmount + "đ";
        payAllPrice2.innerText = totalAmount + 30000 + "đ";
    })

}

window.addEventListener('load', async () => {
    try {
        const userResponse = await axios.get('/user');
        if (userResponse.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
            addMainCart(cartResponse.data);
        }
    } catch (error) {
        console.log(error);
    }
});

buyAllButton.addEventListener('click', async () => {
    aleartx.append(aleartSuccess);

    setTimeout(function () {
        aleartx.removeChild(aleartSuccess);
    }, 3000)
    try {
        const userResponse = await axios.get('/user');
        if (userResponse.data.user_id) {
            const cartResponse = await axios.get(`/cart?userId=${userResponse.data.user_id}`);
            const data = await axios.post(`/cart/${userResponse.data.user_id}`, { totalAmount: totalAmount });

            // setTimeout(function () {
            //     location.reload();
            // }, 3000)  
            deleteAllCartItems();
        }
    } catch (error) {
        console.log(error);
    }

})