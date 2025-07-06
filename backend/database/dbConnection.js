import mongoose from "mongoose"
const dbConnection=()=>{
 
try {
   if(!process.env.DBCONNECTION_STRING){
      console.log("not available Db connection string")
   }   
   else{
      mongoose.connect(process.env.DBCONNECTION_STRING)
      console.log("db connected successfully ....")
   }

} catch (error) {
   console.log("DB connecting error :",error)
      
}


}
export default dbConnection