import DepartmentModel from "./department.model.js";

export const createDepartment = async (req, res) => {
  try {
    const newDepartment = new DepartmentModel(req.body);
    await newDepartment.save();
    return res.json({
      message: "Department created successfully!",
      department: newDepartment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create department!" });
  }
};

export const findAllDepartment = async (req, res) => {
  try {
    const departments = await DepartmentModel.find().sort({createdAt:-1});
    return res.json({ departments });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch departments!" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedDepartment)
      return res.status(404).json({ message: "Department not found!" });
    return res.json({
      message: "Department updated successfully!",
      department: updatedDepartment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update department!" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DepartmentModel.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Department not found!" });
    return res.json({ message: "Department deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete department!" });
  }
};


export const findDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id);
    if (!department)
      return res.status(404).json({ message: "Department not found!" });
    return res.json({ department });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch department!" });
  }
};


export const findDepartmentByType = async(req,res)=>{
    try {
    const { type } = req.params;
    const department = await DepartmentModel.find({type:type});
    if (!department)
      return res.status(404).json({ message: "Department not found!" });
    return res.json({ department });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch department!" });
  }
}