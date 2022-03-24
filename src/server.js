import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import blogsRouter from "./services/blogs/index.js"
import commentsRouter from "./services/comments/index.js"
import { badRequestHandler, notFoundHandler, genericErrorHandler } from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

// ***************************************** MIDDLEWARES **************************************

server.use(cors())
server.use(express.json())

// ****************************************** ENDPOINTS ***************************************

server.use("/blogs", [blogsRouter, commentsRouter])
server.use("/blogs", [blogsRouter, commentsRouter])

// ***************************************** ERROR HANDLERS ***********************************

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

mongoose.connect(process.env.MONGODB_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to Mongo!")

    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server running on port ${port}`)
    })
})
