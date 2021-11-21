const categories = require('../models/category');

async function findCategories(req, res) {
    if (req.query['id'] != null) {
        const Categories = await categories.findAll({
            where: {
                id: req.query.id
            }
        });
        const data = JSON.stringify(Categories, null, 2)
        res.send(data);
    } else {
        const allCategories = await categories.findAll();
        const data = JSON.stringify(allCategories, null, 2)
        res.send(data);
    }
}

module.exports = {
    findCategories
}