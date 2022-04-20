import createError from "http-errors"

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.author.role === "Admin") {
    next()
  } else {
    next(createError(403, "Admin Only Endpoint!"))
  }
}
