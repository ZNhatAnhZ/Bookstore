
function addMainCart(data) {
    data.forEach(async (e) => {
        const ProductsResponse = await axios.get(`/products?id=${e.product_id}`);

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

        seeMoreButton.innerText = 'Xem chi tiet &gt;&gt;';
        seeMoreDiv.append(seeMoreButton);

        const productPriceDiv = document.createElement('div');
        productPriceDiv.classList.add('main-product-price');
        const productPrice = document.createElement('div');
        productPrice.classList.add('product-price-current');

        productPrice.innerText = ProductsResponse.data.product_price;
        productPriceDiv.append(productPrice);

        const productQuantityDiv = document.createElement('div');
        productQuantityDiv.classList.add('main-product-number');
        const productQuantityLabel = document.createElement('label');

        const productQuantityInput = document.createElement('input');

        const productPriceAllDiv = document.createElement('div');
        productPriceAllDiv.classList.add('main-product-allprice');
        const productPriceAll = document.createElement('span');

        const productDeleteDiv = document.createElement('div');
        productDeleteDiv.classList.add('main-product-delete');
        const productDeleteButton = document.createElement('button');
        productDeleteButton.classList.add('product-delete-btn');
        const lineBreak = document.createElement('div');
        lineBreak.classList.add('_2aRlry');


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