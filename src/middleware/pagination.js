module.exports = function (model) {
    return async function (req, res, next) {
        const queryStr = req.query.q || '';

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {}

        if (endIndex < await model.countDocuments().exec()) {
            result.next = {
                page: page + 1,
                limit, queryStr
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit, queryStr
            }
        }
        try {

            const data = queryStr ? await model.find({ title: { $regex: new RegExp(queryStr), $options: "i" } })
                                                            .limit(limit).skip(startIndex).exec()
                : await model.find().limit(limit).skip(startIndex).exec();

            result.current = {
                data, page, queryStr
            }

            res.paginatedResult = result;
            next();
        } catch (e) {
            res.status(500).json({message: e.message});
        }
    }
}