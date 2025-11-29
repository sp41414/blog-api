const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const SECRET = process.env.SECRET;
const db = require("../db/prisma");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
};

passport.use(
    new JwtStrategy(opts, async (payload, done) => {
        try {
            const user = await db.users.findFirst({
                where: {
                    id: payload.id,
                },
            });
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(err);
        }
    }),
);

module.exports = passport;
