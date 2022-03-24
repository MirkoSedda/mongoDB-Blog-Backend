import mongoose from "mongoose"

const { Schema, model } = mongoose

const AuthorSchema = new Schema(
    {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
        blog: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
    },
    {
        timestamps: true,
    }
)

export default model("Author", AuthorSchema)



// ************************* CUSTOM METHOD *********************************************
// we are going to attach a custom method to the schema and therefor everywhere we import the model we gonna have that method available

//bookSchema.static("findBooksWithAuthors", async function (mongoQuery) {
    // If I use an arrow function here, "this" will result in an undefined value. If I use a normal function, "this" keyword will refer to the BooksModel itself

//     const total = await this.countDocuments(mongoQuery.criteria)
//     const books = await this.find(mongoQuery.criteria, mongoQuery.options.fields)
//         .limit(mongoQuery.options.limit || 20)
//         .skip(mongoQuery.options.skip || 0)
//         .sort(mongoQuery.options.sort) // no matter in which order you call this methods, Mongo will ALWAYS do SORT, SKIP, LIMIT in this order
//         .populate({ path: "authors", select: "firstName lastName" })

//     return { total, books }
// })

// Usage --> await BooksModel.findBooksWithAuthors(q2m(req.query))


