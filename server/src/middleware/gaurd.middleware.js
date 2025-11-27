import jwt from "jsonwebtoken";

const expireSession = async (res) => {
  res.cookie("accessToken", null, {
    maxAge: 0,
    httpOnly: true,
  });
  res.cookie("refreshToken", null, {
    maxAge: 0,
    httpOnly: true,
  });

  res.status(400).json({ message: "Bad Request" });
};

// Admin guard
export const AdminGaurd = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) return expireSession(res);

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    // Make role comparison case-insensitive
    if (payload.role.toLowerCase() !== "admin") return expireSession(res);

    req.user = payload;
    next();
  } catch (err) {
    return expireSession(res);
  }
};

// Student guard
export const StudentGaurd = async (req, res, next) => {
  try {

    const { accessToken } = req.cookies;

    if (!accessToken) return expireSession(res);

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (payload.role.toLowerCase() !== "student") return expireSession(res);

    req.user = payload;
    next();
  } catch (err) {
    return expireSession(res);
  }
};

// Admin or Student guard
export const AdminStudentGaurd = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) return expireSession(res);

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    const role = payload.role.toLowerCase();
    if (role !== "student" && role !== "admin") return expireSession(res);

    req.user = payload;
    next();
  } catch (err) {
    return expireSession(res);
  }
};

// Admin, Student, or Professor guard
export const AdminStudentProfessorGaurd = async (req, res, next) => {
  try {
    console.log("AdminStudentProfessorGaurd hit");
    const { accessToken } = req.cookies;
    if (!accessToken) return expireSession(res);

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    const role = payload.role.toLowerCase();
    if (role !== "student" && role !== "admin" && role !== "professor")
      return expireSession(res);

    req.user = payload;
    next();
  } catch (err) {
    return expireSession(res);
  }
};
