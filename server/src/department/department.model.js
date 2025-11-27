import { model, Schema } from "mongoose";


const departmentSchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
    },
    type:{
        type:"String",
        required:true,
        lowercase:true,
    },
    noOfUsers:{
        type:String,
        default:0
    }
},{timestamps:true})

const DepartmentModel = model("Department",departmentSchema);

export default DepartmentModel ; 