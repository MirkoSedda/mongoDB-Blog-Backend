import express from "express"
import createError from "http-errors"
import authorsModel from "./model.js"
import blogsModel from "../blogs/model.js"

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
    try {
        const newAuthor = new authorsModel(req.body)

        const { _id } = await newAuthor.save()
        res.status(201).send({ _id })
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/", async (req, res, next) => {
    try {
        const authors = await authorsModel.find()
        res.send(authors)
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:authorId", async (req, res, next) => {
    try {
        const author = await authorsModel.findById(req.params.authorId)
        if (author) {
            res.send(author)
        } else {
            next(createError(404, `Author with id ${req.params.authorId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.put("/:authorId", async (req, res, next) => {
    try {
        const updatedAuthor = await authorsModel.findByIdAndUpdate(
            req.params.authorId,
            req.body,
            { new: true, runValidators: true }
        )

        if (updatedAuthor) {
            res.send(updatedAuthor)
        } else {
            next(createError(404, `Author with id ${req.params.authorId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.delete("/:authorId", async (req, res, next) => {
    try {
        const deletedAuthor = await authorsModel.findByIdAndDelete(req.params.authorId)
        if (deletedAuthor) {
            res.status(204).send()
        } else {
            next(createError(404, `Author with id ${req.params.authorId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.post("/:authorId/blogs", async (req, res, next) => {
    try {
        const author = await authorsModel.findById(req.body.authorsId, { _id: 0 })
        if (blogs) {

            const blogToInsert = {
                ...writtenBlog.toObject(),
                purchaseDate: new Date(),
            }

            const modifiedUser = await authorsModel.findByIdAndUpdate(
                req.params.userId, // WHO
                { $push: { purchaseHistory: bookToInsert } }, // HOW
                { new: true, runValidators: true } // OPTIONS
            )

            if (modifiedUser) {
                res.send(modifiedUser)
            } else {
                next(createError(404, `User with id ${req.params.userId} not found!`))
            }
        } else {
            next(createError(404, `Book with id ${req.body.bookId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:author/blogs", async (req, res, next) => {
    try {
        const author = await authorsModel.findById(req.params.authorsId)
        if (author) {
            res.send(author.blogs)
        } else {
            next(createError(404, `Author with id ${req.params.authorId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.get("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
    try {
        const user = await authorsModel.findById(req.params.userId)
        if (user) {
            const purchasedBook = user.purchaseHistory.find(book => book._id.toString() === req.params.bookId) // You CANNOT compare a string (req.params.bookId) with an ObjectID (book._id) --> we shall convert ObjectId into a string

            if (purchasedBook) {
                res.send(purchasedBook)
            } else {
                next(createError(404, `Book with id ${req.params.bookId} not found!`))
            }
        } else {
            next(createError(404, `User with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
}) // retrieve single item from purchase history of specific user

authorsRouter.put("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
    try {
        // 1. Find user

        const user = await authorsModel.findById(req.params.userId)
        if (user) {
            // 2. Modify user (with JS)

            const index = user.purchaseHistory.findIndex(book => book._id.toString() === req.params.bookId)

            if (index !== -1) {
                user.purchaseHistory[index] = { ...user.purchaseHistory[index].toObject(), ...req.body }

                // 3. Save it back

                await user.save() // since user is a MONGOOSE DOCUMENT we can use .save()

                res.send(user)
            } else {
                next(createError(404, `Book with id ${req.params.bookId} not found!`))
            }
        } else {
            next(createError(404, `User with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
}) // modify single item in purchase history of specific user

authorsRouter.delete("/:userId/purchaseHistory/:bookId", async (req, res, next) => {
    try {
        const modifiedUser = await authorsModel.findByIdAndUpdate(
            req.params.userId, // WHO
            { $pull: { purchaseHistory: { _id: req.params.bookId } } }, // HOW
            { new: true }
        )

        if (modifiedUser) {
            res.send(modifiedUser)
        } else {
            next(createError(404, `User with id ${req.params.userId} not found!`))
        }
    } catch (error) {
        next(error)
    }
}) // delete single item from purchase history of specific user

export default authorsRouter
