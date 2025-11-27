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
} from "antd";
import { FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
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

const StudentAssignment = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("assignment");

  const [singleFile, setSingleFile] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);

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

  // Form validation
  const validateForm = (files) => {
    if (!selectedProfessor) return toast.error("Select professor");
    if (!title.trim()) return toast.error("Enter title");
    if (!description.trim()) return toast.error("Enter description");
    if (!files || files.length === 0) return toast.error("Select file(s)");
    return true;
  };

  // Upload handler
  const handleUpload = async (files) => {
    if (!validateForm(files)) return;

    const formData = new FormData();
    for (let f of files) {
      if (f.type !== "application/pdf") return toast.error("Only PDF allowed");
      if (f.size > 10 * 1024 * 1024) return toast.error("Max size 10MB each");
      formData.append("assignments", f);
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", type);

    // Only append professor ID if selected
    if (selectedProfessor) {
      formData.append("submittedTo", selectedProfessor);
    }

    try {
      setLoading(true);
      const url = files.length === 1
        ? "http://localhost:4040/assignment/upload"
        : "http://localhost:4040/assignment/upload-multiple";

      await axios.post(url, formData, { withCredentials: true });
      toast.success("Uploaded Successfully");

      // Reset files
      if (files.length === 1) setSingleFile(null);
      else setBulkFiles([]);
      loadAssignments();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Table columns (show professor ID)
  const columns = [
    { title: "Title", dataIndex: "title", render: (t) => <b>{t}</b> },
    { title: "Submitted To (Professor ID)", dataIndex: "submittedTo", render: (t) => t?._id || t },
    { title: "Type", dataIndex: "category" },
    { title: "Status", dataIndex: "status", render: (s) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag> },
    { title: "Actions", render: (r) => <Button onClick={() => navigate(`/student/assignments/${r._id}`)}>View</Button> },
  ];

  if (!session || sessionLoading) return <Skeleton active />;

  return (
    <Layout>
      <Content className="p-8">
        {/* Shared Fields */}
        <Card className="shadow-lg p-6 mb-6">
          <Select value={type} onChange={setType} className="w-full mb-3">
            <Option value="assignment">Assignment</Option>
            <Option value="research paper">Research Paper</Option>
            <Option value="thesis">Thesis</Option>
          </Select>

          <Input
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3"
          />

          <TextArea
            rows={3}
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-3"
          />

          <Select
            placeholder="Select Professor"
            value={selectedProfessor}
            onChange={setSelectedProfessor}
            className="w-full"
          >
            {professors.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.name} ({p.department})
              </Option>
            ))}
          </Select>
        </Card>

        {/* Tabs for Single/Bulk Upload */}
        <Tabs defaultActiveKey="single">
          {/* Single Upload Tab */}
          <TabPane tab="Single Upload" key="single">
            <Card className="shadow-lg p-6 mb-6">
              <Upload
                beforeUpload={(file) => { setSingleFile(file); return false; }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Single PDF</Button>
              </Upload>
              {singleFile && (
                <p className="flex items-center gap-2 mt-2">
                  <FilePdfOutlined /> {singleFile.name}
                </p>
              )}
              <Button
                onClick={() => handleUpload(singleFile ? [singleFile] : [])}
                loading={loading}
                className="!bg-blue-600 !text-white mt-4"
              >
                Upload Single File
              </Button>
            </Card>
          </TabPane>

          {/* Bulk Upload Tab */}
          <TabPane tab="Bulk Upload" key="bulk">
            <Card className="shadow-lg p-6 mb-6">
              <Upload
                multiple
                beforeUpload={(file) => { setBulkFiles((prev) => [...prev, file]); return false; }}
              >
                <Button icon={<UploadOutlined />}>Select Multiple PDFs</Button>
              </Upload>
              {bulkFiles.length > 0 && (
                <div className="mt-2">
                  {bulkFiles.map((f, i) => (
                    <p key={i} className="flex items-center gap-2">
                      <FilePdfOutlined /> {f.name}
                    </p>
                  ))}
                </div>
              )}
              <Button
                onClick={() => handleUpload(bulkFiles)}
                loading={loading}
                className="!bg-red-600 !text-white mt-4"
              >
                Upload Bulk Files
              </Button>
            </Card>
          </TabPane>
        </Tabs>

        {/* Assignments Table */}
        <Card className="shadow-md">
          <Table dataSource={assignments} columns={columns} rowKey="_id" />
        </Card>

        <ToastContainer />
      </Content>
    </Layout>
  );
};

export default StudentAssignment;
