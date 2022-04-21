import GoogleStrategy from "passport-google-oauth20"
import passport from "passport"
import AuthorsModel from "../services/authors/model.js"
import { generateAccessToken } from "./tools.js"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // this callback is executed when Google sends us a successfull response back (through the redirect url)
      // here we are receiving some informations about the author from Google (scopes --> profile, email)
      console.log("PROFILE: ", profile)

      // 1. Check if author is already in our db

      const author = await AuthorsModel.findOne({
        email: profile.emails[0].value,
      })

      if (author) {
        // 2. If author is there --> generate an accessToken for him/her
        const accessToken = await generateAccessToken({
          _id: author._id,
          role: author.role,
        })

        // 3. We go next (we go to the route handler --> /authors/googleRedirect)
        passportNext(null, { token: accessToken })
      } else {
        // 4. Else if author is not in db --> add author to db and then create token for him/her.
        const newAuthor = new AuthorsModel({
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        })

        const savedAuthor = await newAuthor.save()
        const accessToken = await generateAccessToken({
          _id: savedAuthor._id,
          role: savedAuthor.role,
        })

        // 5. We go next
        passportNext(null, { token: accessToken })
      }
    } catch (error) {
      passportNext(error)
    }
  }
)

// If you get the "Failed to serialize user into session" error, you have to add the following code

passport.serializeUser((data, passportNext) => {
  passportNext(null, data)
})

export default googleStrategy
