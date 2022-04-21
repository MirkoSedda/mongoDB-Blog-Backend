import express from "express"
import passport from "passport"
import createError from "http-errors"
import authorsModel from "./model.js"

import { generateAccessToken } from "../../auth/tools.js"
import { JWTAuthMiddleware } from "../../auth/JWTmiddleware.js"
import { adminOnlyMiddleware } from "../../auth/adminOnlyMiddleware.js"

const authorsRouter = express.Router()

authorsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const authors = await authorsModel.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new authorsModel(req.body)

    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const author = await authorsModel.checkCredentials(email, password)

    if (author) {
      // 3. If credentials are ok we are going to generate an Access Token and send it as a response

      const accessToken = await generateAccessToken({
        _id: author._id,
        role: author.role,
      })

      res.send({ accessToken })
    } else {
      // 4. If credentials are not fine --> throw an error (401)
      next(createError(401, `Credentials are not ok!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const author = await authorsModel.findById(req.author._id)
    if (author) {
      res.send(author)
    } else {
      next(401, `Author with id ${req.author._id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const modifiedAuthor = await authorsModel.findByIdAndUpdate(
      req.author._id,
      req.body,
      {
        new: true,
      }
    )

    if (modifiedAuthor) {
      res.send(modifiedAuthor)
    } else {
      next(401, `Author with id ${req.author._id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deletedAuthor = await authorsModel.findByIdAndDelete(req.author._id)

    if (deletedAuthor) {
      res.send()
    } else {
      next(401, `Author with id ${req.author._id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

authorsRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log("Token: ", req.author.token)

      if (req.author.role === "Admin") {
        res.redirect(
          `${process.env.FE_URL}/adminDashboard?accessToken=${req.author.token}`
        )
      } else {
        res.redirect(
          `${process.env.FE_URL}/profile?accessToken=${req.author.token}`
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

authorsRouter.get(
  "/:authorId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const author = await authorsModel.findById(req.params.authorId)
      if (author) {
        res.send(author)
      } else {
        next(
          createError(404, `Author with id ${req.params.authorId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

authorsRouter.put(
  "/:authorId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedAuthor = await authorsModel.findByIdAndUpdate(
        req.params.authorId,
        req.body,
        { new: true, runValidators: true }
      )

      if (updatedAuthor) {
        res.send(updatedAuthor)
      } else {
        next(
          createError(404, `Author with id ${req.params.authorId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

authorsRouter.delete(
  "/:authorId",
  JWTAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const deletedAuthor = await authorsModel.findByIdAndDelete(
        req.params.authorId
      )
      if (deletedAuthor) {
        res.status(204).send()
      } else {
        next(
          createError(404, `Author with id ${req.params.authorId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

export default authorsRouter
