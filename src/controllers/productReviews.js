const product_review = require('../models/product_review');

async function getProductRating(req, res) {
    const { id } = req.params;
    const comment = await product_review.findAll({
        where: {
            review_product_id: id
        }
    });

    let meanRating = 0;
    comment.forEach((element) => {
        meanRating = meanRating + element.rating;
    })
    meanRating = Math.floor(meanRating / comment.length);
    const data = JSON.stringify(meanRating, null, 2)
    res.send(data);
}

module.exports = {
    getProductRating
}