import { User } from "../model/user.model.js"
import jwt from 'jsonwebtoken'

const protectRoute = async (req, res, next)=>{

    const token = req.cookies.jwt 
    if(!token){
      return res.status(400).json({
           message:"unauthorized : token not available" 
      })
    }

    const encoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!encoded){
      return res.status(400).json({
           message:"unauthorized : Invalid Token" 
      })
    }

    const user = await User.findOne({_id :encoded.userId}).select("-password") 
    if(!user){
      return res.status(400).json({
           message:"User Not Found " 
      })
    }

    req.user = user;

    next()
}
export default protectRoute