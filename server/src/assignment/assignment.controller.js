import AssignmentModel from "./assignment.model.js";

export const uploadAssignment = async (req, res) => {
  try {
    console.log("Uploaded file :", req.file);

    const relativePath = `assignment/${req.file.filename}`;

    const newAssignment = new AssignmentModel({
      ...req.body,
      path: `http://localhost:4040/${relativePath}`, 
      submittedBy: req.user.id,
    });

    await newAssignment.save();

    return res.status(200).json({
      message: "Assignment uploaded successfully.",
      fileUrl: `http://localhost:4040/${relativePath}`,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const fetchAssignmentByStudent = async(req , res)=>{
  try{


    const assignments = await  AssignmentModel.find({submittedBy:req.user.id}) ; 


    if(!assignments) return res.status(200).json({message:"No assignment subbmitted by student"}) ; 
    return res.status(200).json({assignments:assignments}) ;

  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"Failed to fetch assignment!"})
  }
}


export const fetchAssignmentByProffesor = async(req , res)=>{
  try{


    const assignments = AssignmentModel.find({submittedTo:req.user.id}) ; 

    if(!assignments) return res.status(200).json({message:"No assignment present for reviewing..."}) ; 
    return res.status(200).json(assignments) ;
    
  }
  catch(err){
    return res.status(500).json({message:"Failed to fetch assignment!"})
  }
}





export const fetchAssignmentById = async(req,res)=>{
  try{


    const {id} = req.params ; 

    const assignment = await AssignmentModel.findById(id);
    if(!assignment) return res.status(400).json({message:"Assignment not found"}); 
    return res.json({assignment:assignment}) ; 

  }
  catch(err){
    return res.status(500).json({message:"Failed to fetch assignment"}) ; 
  }
}