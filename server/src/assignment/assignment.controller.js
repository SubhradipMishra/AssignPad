import AssignmentModel from "./assignment.model.js";

export const uploadAssignmentSingle = async (req, res) => {
  try {
    const relativePath = `assignment/${req.file.filename}`;

    const newAssignment = new AssignmentModel({
      ...req.body,
      path: `http://localhost:4040/${relativePath}`,
      submittedBy: req.user.id,

      // ⭐ NEW HISTORY ENTRY
      history: [
        {
          status: "submitted",
          message: "Initial submission",
          changedBy: req.user.id,
          changedByName: req.user.fullname,   // Store professor/student name
          submittedDate: new Date(),
          filePath: `http://localhost:4040/${relativePath}`,
        }
      ]
    });

    await newAssignment.save();

    res.status(200).json({
      message: "Assignment uploaded",
      fileUrl: `http://localhost:4040/${relativePath}`,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: err.message });
  }
};


export const uploadAssignmentBulk = async (req, res) => {
  try {
    if (!req.files.length)
      return res.status(400).json({ message: "No files uploaded" });

    const assignments = await Promise.all(
      req.files.map((file) => {
        const fileUrl = `http://localhost:4040/assignment/${file.filename}`;
        return new AssignmentModel({
          ...req.body,
          path: fileUrl,
          submittedBy: req.user.id,

          // ⭐ NEW HISTORY ENTRY FOR EACH FILE
          history: [
            {
              status: "submitted",
              message: "Bulk submission",
              changedBy: req.user.id,
              changedByName: req.user.fullname,
              submittedDate: new Date(),
              filePath: fileUrl,
            }
          ]
        }).save();
      })
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
