const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
    genToken(username) {
        return jwt.sign(
            { username },
            MyConstants.JWT_SECRET,
            { expiresIn: MyConstants.JWT_EXPRES }
        );
    },

   checkToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['x-access-token'];

    if (!authHeader) {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Token is not valid'
            });
        }
        req.decoded = decoded;
        next();
    });
}

};

module.exports = JwtUtil;
