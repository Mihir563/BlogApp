const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;

const authMiddleware = async (req,res,next) => {
  
    const token = req.header('Authorization').replace('Bearer ', '');
 
    if(!token){
        res.status(401).json({message:"no token, auth failed"})
    }
    
    try {
        const decoded = jwt.verify(token, jwtKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

module.exports = authMiddleware;