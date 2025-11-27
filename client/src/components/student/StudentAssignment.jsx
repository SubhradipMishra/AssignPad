"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Card,
  Skeleton,
  Typography,
  Upload,
  Button,
  Table,
  Tag,
  Select,
  Input,
  Tabs,
  Space,
} from "antd";
import { FilePdfOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Context from "../../utils/Context";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const statusColors = {
  draft: "orange",
  submitted: "blue",
  approved: "green",
  rejected: "red",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const StudentAssignment = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [professors, setProfessors] = useState([]);

  // Single Upload States
  const [singleTitle, setSingleTitle] = useState("");
  const [singleDescription, setSingleDescription] = useState("");
  const [singleType, setSingleType] = useState("assignment");
  const [singleProfessor, setSingleProfessor] = useState(null);
  const [singleFile, setSingleFile] = useState(null);

  // Bulk Upload States
  const [bulkTitle, setBulkTitle] = useState("");
  const [bulkDescription, setBulkDescription] = useState("");
  const [bulkType, setBulkType] = useState("assignment");
  const [bulkProfessor, setBulkProfessor] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);

   useEffect(() => {
      if (!sessionLoading && (!session || session.role !== "student")) {
        navigate("/");
      }
    }, [session, sessionLoading, navigate]);

  // Load professors
  const loadProfessors = async () => {
    try {
      const { data } = await axios.get("http://localhost:4040/auth/proffesor", {
        withCredentials: true,
      });
      setProfessors(data.professors || []);
    } catch (err) {
      toast.error("Failed to load professors");
    }
  };

  // Load assignments
  const loadAssignments = async () => {
    try {
      const { data } = await axios.get("http://localhost:4040/assignment/byStudent", {
        withCredentials: true,
      });
      setAssignments(data.assignments || []);
    } catch (err) {
      toast.error("Failed to load assignments");
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      loadProfessors();
      loadAssignments();
    }
  }, [sessionLoading]);

  const validateForm = (title, description, professor, files) => {
    if (!professor) {
      toast.error("Select professor");
      return false;
    }
    if (!title.trim()) {
      toast.error("Enter title");
      return false;
    }
    if (!description.trim()) {
      toast.error("Enter description");
      return false;
    }
    if (!files || (Array.isArray(files) && files.length === 0)) {
      toast.error("Select file(s)");
      return false;
    }
    return true;
  };

  const isPdfAndSizeOk = (file) => {
    if (!file) return false;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      toast.error(`${file.name} is not a PDF`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 10MB`);
      return false;
    }
    return true;
  };

  // --- SINGLE FILE UPLOAD ---
  const submitSingle = async () => {
  const filesToSend = singleFile ? [singleFile] : [];
  if (!validateForm(singleTitle, singleDescription, singleProfessor, filesToSend)) return;
  if (!isPdfAndSizeOk(singleFile)) return;

  const formData = new FormData();
  formData.append("assignment", singleFile);
  formData.append("title", singleTitle);
  formData.append("description", singleDescription);
  formData.append("category", singleType);
  formData.append("submittedTo", singleProfessor); // professor.id is correct now

  // Correct logging
  for (let p of formData.entries()) {
    console.log(p[0], p[1]);
  }

  try {
    setLoading(true);

    await axios.post(
      "http://localhost:4040/assignment/upload",
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success("Uploaded Successfully");

    setSingleFile(null);
    setSingleTitle("");
    setSingleDescription("");
    setSingleType("assignment");
    setSingleProfessor(null);

    loadAssignments();
  } catch (err) {
    console.log("error",err.meesage);
    toast.error("Upload failed");
  } finally {
    setLoading(false);
  }
};


  // --- BULK UPLOAD ---
  const submitBulk = async () => {
    if (!validateForm(bulkTitle, bulkDescription, bulkProfessor, bulkFiles)) return;

    for (const f of bulkFiles) {
      if (!isPdfAndSizeOk(f)) return;
    }

    const formData = new FormData();
    bulkFiles.forEach((file) => formData.append("assignments", file)); // correct field

    formData.append("title", bulkTitle);
    formData.append("description", bulkDescription);
    formData.append("category", bulkType);
    formData.append("submittedTo", bulkProfessor);

    try {
      setLoading(true);

      await axios.post("http://localhost:4040/assignment/upload-multiple", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Uploaded Successfully");

      // Reset
      setBulkFiles([]);
      setBulkTitle("");
      setBulkDescription("");
      setBulkType("assignment");
      setBulkProfessor(null);

      loadAssignments();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Upload handlers
  const handleSingleBeforeUpload = (file) => {
    setSingleFile(file.originFileObj || file);
    return false;
  };

  const handleBulkBeforeUpload = (file) => {
    const realFile = file.originFileObj || file;
    setBulkFiles((prev) => {
      const exists = prev.some((f) => f.name === realFile.name && f.size === realFile.size);
      if (exists) return prev;
      return [...prev, realFile];
    });
    return false;
  };

  const handleBulkRemove = (index) => {
    setBulkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const columns = [
    { title: "Title", dataIndex: "title", render: (t) => <b>{t}</b> },
    { title: "Submitted To (Professor ID)", dataIndex: "submittedTo", render: (t) => t?.id || t },
    { title: "Type", dataIndex: "category" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      render: (r) => (
        <Button onClick={() => navigate(`/student/assignments/${r._id}`)}>View</Button>
      ),
    },
  ];

  if (!session || sessionLoading) return <Skeleton active />;

  return (
    <Layout>
      <Content className="p-8">
        <Tabs defaultActiveKey="single">
          {/* SINGLE */}
          <TabPane tab="Single Upload" key="single">
            <Card className="shadow-lg p-6 mb-6">
              <Select value={singleType} onChange={setSingleType} className="w-full mb-3">
                <Option value="assignment">Assignment</Option>
                <Option value="research paper">Research Paper</Option>
                <Option value="thesis">Thesis</Option>
              </Select>

              <Input
                placeholder="Enter Title"
                value={singleTitle}
                onChange={(e) => setSingleTitle(e.target.value)}
                className="mb-3"
              />

              <TextArea
                rows={3}
                placeholder="Enter Description"
                value={singleDescription}
                onChange={(e) => setSingleDescription(e.target.value)}
                className="mb-3"
              />

              <Select
                placeholder="Select Professor"
                value={singleProfessor}
                onChange={setSingleProfessor}
                className="w-full mb-3"
              >
                {professors.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.name} ({p.department})
                  </Option>
                ))}
              </Select>

              <Upload
                beforeUpload={handleSingleBeforeUpload}
                showUploadList={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Single PDF</Button>
              </Upload>

              {singleFile && (
                <div className="flex items-center gap-2 mt-2">
                  <FilePdfOutlined />
                  <span>{singleFile.name}</span>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => setSingleFile(null)}
                  />
                </div>
              )}

              <Button
                onClick={submitSingle}
                loading={loading}
                className="!bg-blue-600 !text-white mt-4"
              >
                Upload Single File
              </Button>
            </Card>
          </TabPane>

          {/* BULK */}
          <TabPane tab="Bulk Upload" key="bulk">
            <Card className="shadow-lg p-6 mb-6">
              <Select value={bulkType} onChange={setBulkType} className="w-full mb-3">
                <Option value="assignment">Assignment</Option>
                <Option value="research paper">Research Paper</Option>
                <Option value="thesis">Thesis</Option>
              </Select>

              <Input
                placeholder="Enter Title"
                value={bulkTitle}
                onChange={(e) => setBulkTitle(e.target.value)}
                className="mb-3"
              />

              <TextArea
                rows={3}
                placeholder="Enter Description"
                value={bulkDescription}
                onChange={(e) => setBulkDescription(e.target.value)}
                className="mb-3"
              />

              <Select
                placeholder="Select Professor"
                value={bulkProfessor}
                onChange={setBulkProfessor}
                className="w-full mb-3"
              >
                {professors.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.name} ({p.department})
                  </Option>
                ))}
              </Select>

              <Upload multiple beforeUpload={handleBulkBeforeUpload} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Select Multiple PDFs</Button>
              </Upload>

              {bulkFiles.length > 0 && (
                <div className="mt-2">
                  {bulkFiles.map((f, i) => (
                    <Space key={i} className="mb-2">
                      <FilePdfOutlined />
                      <span>{f.name}</span>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleBulkRemove(i)}
                      />
                    </Space>
                  ))}
                </div>
              )}

              <Button
                onClick={submitBulk}
                loading={loading}
                className="!bg-red-600 !text-white mt-4"
              >
                Upload Bulk Files
              </Button>
            </Card>
          </TabPane>
        </Tabs>

        <Card className="shadow-md">
          <Table dataSource={assignments} columns={columns} rowKey="id" />
        </Card>

        <ToastContainer />
      </Content>
    </Layout>
  );
};

export default StudentAssignment;
