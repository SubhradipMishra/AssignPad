import AssignmentModel from "./assignment.model.js";

export const uploadAssignmentSingle = async (req, res) => {
  try {
    const relativePath = `assignment/${req.file.filename}`;

    const newAssignment = new AssignmentModel({
      ...req.body,
      path: `${process.env.BASE_URL}/${relativePath}`,
      submittedBy: req.user.id,
    });

    await newAssignment.save();

    res.status(200).json({
      message: "Assignment uploaded",
      fileUrl: `http://localhost:4000/${relativePath}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadAssignmentBulk = async (req, res) => {
  try {

    console.log(req.body);
    if (!req.files.length)
      return res.status(400).json({ message: "No files uploaded" });

    const assignments = await Promise.all(
      req.files.map((file) =>
        new AssignmentModel({
          ...req.body,
          path: `http://localhost:4000/assignment/${file.filename}`,
          submittedBy: req.user.id,
        }).save()
      )
    );

    res.status(200).json({
      message: "Assignments uploaded",
      uploadedFiles: assignments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchAssignmentByStudent = async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({
      submittedBy: req.user.id,
    });

    if (!assignments.length)
      return res.status(200).json({ message: "No assignment submitted" });

    res.status(200).json({ assignments });
  } catch {
    res.status(500).json({ message: "Failed to fetch" });
  }
};

export const fetchAssignmentByProffesor = async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({
      submittedTo: req.user.id,
    });

    if (!assignments.length)
      return res.status(200).json({ message: "No assignments found" });

    res.status(200).json(assignments);
  } catch {
    res.status(500).json({ message: "Failed to fetch" });
  }
};

export const fetchAssignmentById = async (req, res) => {
  try {
    const assignment = await AssignmentModel.findById(req.params.id);
    if (!assignment) return res.status(400).json({ message: "Not found" });
    res.json({ assignment });
  } catch {
    res.status(500).json({ message: "Failed to fetch" });
  }
};
