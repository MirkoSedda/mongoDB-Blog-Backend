export const badRequestHandler = (err, req, res, next) => {
    if (err.status === 400 || err.name === "ValidationError") {
        res.status(400).send({ message: err.message })
    } else {
        next(err)
    }
}

export const notFoundHandler = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ message: err.message })
    } else {
        next(err)
    }
}

export const genericErrorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: "Generic Server Error" })
}