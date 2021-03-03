
const Book = require('../models').Book;
const Course = require('../models').Course;

module.exports = {
    list(req, res) {
        return Book
            .findAll({
                include: [{
                    model: Course,
                    as: 'course'
                }],
                order: [
                    ['createdAt', 'DESC'],
                    [{ model: Course, as: 'course' }, 'createdAt', 'DESC'],
                ],
            })
            .then((books) => res.status(200).send(books))
            .catch((error) => { res.status(400).send(error); });
    },

    getById(req, res) {
        return Book
            .findByPk(req.params.id, {
                include: [{
                    model: Course,
                    as: 'course'
                }],
            })
            .then((book) => {
                if (!book) {
                    return res.status(404).send({
                        message: 'Book Not Found',
                    });
                }
                return res.status(200).send(book);
            })
            .catch((error) => res.status(400).send(error));
    },

    add(req, res) {
        return Book
            .create({
                course_id: req.body.course_id,
                book_name: req.body.book_name,
            })
            .then((book) => res.status(201).send(book))
            .catch((error) => res.status(400).send(error));
    },


    update(req, res) {
        return Book
            .findByPk(req.params.id, {
                include: [{
                    model: Course,
                    as: 'course'
                }],
            })
            .then(book => {
                if (!book) {
                    return res.status(404).send({
                        message: 'Book Not Found',
                    });
                }
                return book
                    .update({
                        book_name: req.body.book_name || book.book_name,
                    })
                    .then(() => res.status(200).send(book))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {
        return Book
            .findByPk(req.params.id)
            .then(book => {
                if (!book) {
                    return res.status(400).send({
                        message: 'Book Not Found',
                    });
                }
                return book
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },
};