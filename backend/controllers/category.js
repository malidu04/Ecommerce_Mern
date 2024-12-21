const Category = require('../model/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id).exec();
        if(!category) {
            return res.status(400).json({
                error: "Category dosen't exists",
            });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.update = async (req, res) => {
    const category = req.category;
    categpry.name = req.body.name;
    try {
        const data = await category.save();
        res.json(data);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

exports.remove = async (req, res) => {
    const category = req.category;
    try {
        await category.remove();
        res.json({
            message: 'Category deleted',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

exports.list = async (req, res) => {
    try {
        const data = await Category.find().exec();
        res.json(data);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};

