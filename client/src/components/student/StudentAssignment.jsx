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
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Context from "../../utils/Context";
import axios from "axios";

// 🔥 React Toastify imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const statusColors = {
  draft: "orange",
  submitted: "blue",
  approved: "green",
  rejected: "red",
};

const sidebarItems = [
  { icon: <DashboardOutlined />, label: "Dashboard", path: "/student/dashboard" },
  { icon: <BookOutlined />, label: "My Courses", path: "/student/courses" },
  { icon: <FileTextOutlined />, label: "Assignments", path: "/student/assignments" },
  { icon: <TrophyOutlined />, label: "Achievements", path: "/student/achievements" },
  { icon: <SettingOutlined />, label: "Settings", path: "/student/settings" },
];

const StudentAssignment = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  // Form state
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("assignment");
  const [formVisible, setFormVisible] = useState(true);

  // Redirect if not student
  useEffect(() => {
    if (!sessionLoading && (!session || session.role !== "student")) {
      navigate("/");
    }
  }, [session, sessionLoading, navigate]);

  // Load professors and assignments
  const loadProfessors = async () => {
    try {
      const res = await axios.get("http://localhost:4040/auth/proffesor", {
        withCredentials: true,
      });
      setProfessors(res.data.professors || []);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:4040/assignment/byStudent", {
        withCredentials: true,
      });
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!sessionLoading) {
      loadProfessors();
      loadAssignments();
    }
  }, [sessionLoading]);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file");
    if (!selectedProfessor) return toast.error("Please select a professor");
    if (!title.trim()) return toast.error("Please enter a title");
    if (!description.trim()) return toast.error("Please enter a description");
    if (file.size > 10 * 1024 * 1024)
      return toast.error("File size cannot exceed 10MB");

    const formData = new FormData();
    formData.append("assignment", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", type);
    formData.append("submittedTo", selectedProfessor);

    try {
      setLoading(true);
      await axios.post("http://localhost:4040/assignment/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Assignment uploaded successfully");

      // Reset fields
      setFile(null);
      setSelectedProfessor(null);
      setTitle("");
      setDescription("");
      setType("assignment");
      loadAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    { title: "Title", dataIndex: "title", render: (t) => <b>{t}</b> },
    {
      title: "Submitted To",
      dataIndex: "submittedTo",
      render: (t) => t?.fullname || t?.name || t || "N/A",
    },
    { title: "Type", dataIndex: "category" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={statusColors[s]}>{s.toUpperCase()}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleString(),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          type="link"
          className="!text-white !font-semibold !bg-red-600 !hover:[bg-red-500]"
          onClick={() => navigate(`/student/assignments/${record._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const filteredAssignments = statusFilter
    ? assignments.filter((a) => a.status === statusFilter)
    : assignments;

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[90vw] sm:w-[600px] p-6 rounded-2xl shadow-md">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="!h-screen !w-screen overflow-hidden">
      <Layout className="!h-full !w-full !bg-gray-100">
        {/* Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={240}
          className="!h-full !bg-[#fff9f9] !border-r !border-gray-300 flex flex-col justify-between !shadow-md transition-all duration-300"
        >
          <div className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <UserOutlined className="!text-red-600 !text-4xl !bg-red-100 p-3 rounded-full" />
            </div>
            {!collapsed && (
              <>
                <Title level={4} className="!mb-1 !text-gray-800 !font-extrabold">
                  Student Panel
                </Title>
                <Text className="!text-gray-600 !text-sm !font-medium">
                  {session.fullname}
                </Text>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 px-5">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg !text-gray-800 hover:!bg-red-100 hover:!text-red-700 !font-semibold transition-all duration-200"
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {!collapsed && (
            <div className="p-4 text-center text-xs !text-red-600 !font-semibold">
              © {new Date().getFullYear()} AsignPad
            </div>
          )}
        </Sider>

        {/* Main Layout */}
        <Layout className="!h-full !overflow-y-auto">
          <Header
            className="!bg-[#fffafa] !border-b !border-gray-300 flex items-center justify-between px-6 !shadow-md"
            style={{ height: "70px" }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-red-600 hover:text-red-700 text-xl"
              >
                {collapsed ? <MenuOutlined /> : <CloseOutlined />}
              </button>

              <Title level={4} className="!mb-0 !text-gray-900 !font-semibold">
                Welcome, <span className="!text-red-600">{session.fullname}</span> 👋
              </Title>
            </div>

            <Text className="!text-gray-700 !font-semibold">{session.email}</Text>
          </Header>

          {/* Content */}
          <Content className="!p-8 !bg-gray-100 min-h-[calc(100vh-70px)]">
            {/* Show/Hide Form */}
            <Button
              type="default"
              onClick={() => setFormVisible(!formVisible)}
              className="mb-4 !bg-red-600 !border !border-gray-300 !text-gray-800 font-bold"
            >
              {formVisible ? "-" : "+"}
            </Button>

            {/* Upload Form */}
            {formVisible && (
              <Card className="mb-8 !border !border-gray-200 !shadow-md p-6">
                <Title level={4} className="!mb-4 !text-gray-900">
                  Upload Assignment
                </Title>

                <div className="flex flex-col space-y-4">
                  <Select value={type} onChange={setType}>
                    <Option value="assignment">Assignment</Option>
                    <Option value="research paper">Research Paper</Option>
                    <Option value="thesis">Thesis</Option>
                  </Select>

                  <Input
                    placeholder="Enter Title"
                    value={title}
                    className="!mt-5"
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <TextArea
                    rows={4}
                    className="!mt-5"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <Select
                  className="!mt-5"
                    placeholder="Select Professor"
                    value={selectedProfessor}
                    onChange={setSelectedProfessor}
                  >
                    {professors.map((p) => (
                      <Option key={p.id} value={p.id}>
                        {p.name} ({p.department})
                      </Option>
                    ))}
                  </Select>

                  <Upload
                    beforeUpload={(file) => {
                      if (file.type !== "application/pdf") {
                        toast.error("Only PDF files allowed");
                        return Upload.LIST_IGNORE;
                      }
                      setFile(file);
                      return false;
                    }}
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button className="!mt-5" icon={<UploadOutlined  />}>Select PDF</Button>
                  </Upload>

                  {file && (
                    <div className="flex items-center gap-2">
                      <FilePdfOutlined className="text-red-600 text-lg" />
                      <span>{file.name}</span>
                    </div>
                  )}

                  <Button
                    type="primary"
                    loading={loading}
                    onClick={handleUpload}
                    className="!bg-red-600 hover:!bg-red-700 !mt-5"
                    block
                  >
                    Upload
                  </Button>
                </div>
              </Card>
            )}

            {/* Filter */}
            <div className="flex justify-between items-center mb-4">
              <Title level={4}>Your Submissions</Title>

              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by Status"
                className="w-48"
                allowClear
              >
                <Option value="draft">Draft</Option>
                <Option value="submitted">Submitted</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </div>

            {/* Table */}
            <Card className="!border !border-gray-300 !shadow-sm !rounded-2xl">
              <Table
                dataSource={filteredAssignments}
                columns={columns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Content>
        </Layout>
      </Layout>

      {/* 🔥 Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentAssignment;
