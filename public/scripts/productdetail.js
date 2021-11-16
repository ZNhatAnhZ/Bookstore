


window.addEventListener('load', async () => {
    try {
        const id = window.location.pathname;
        const product = await axios.get(`/products?id${id}`);
        const user = await axios.get(`/user?id${id}`);


    } catch (error) {
        console.log(error);
    }
});