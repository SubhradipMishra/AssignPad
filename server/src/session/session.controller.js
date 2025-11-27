 const getSession = async(req , res)=>{
  try{
    console.log("Session hit....")
    const session = req.user ;
    return res.json(session); 
  }
  catch(err){

    return res.status(500).json({message:"Failed to get Session....."})
    console.log(err);
  }
}

export default getSession; 