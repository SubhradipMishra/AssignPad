"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Card,
  Skeleton,
  Typography,
  message,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ApartmentOutlined,
  UserAddOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Context from "../../utils/Context";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const sidebarItems = [
  { icon: <DashboardOutlined />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <TeamOutlined />, label: "Users", path: "/admin/users" },
  { icon: <ApartmentOutlined />, label: "Departments", path: "/admin/departments" },
  { icon: <SettingOutlined />, label: "Settings", path: "/admin/settings" },
];

const AdminDepartments = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // 🔐 Session Validation
  useEffect(() => {
    if (sessionLoading === false) {
      if (!session || session.role !== "admin") navigate("/");
    }
  }, [sessionLoading, session, navigate]);

  useEffect(() => {
    if (session) fetchDepartments();
  }, [session]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4040/department");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data.departments || []);
      setFilteredDepartments(data.departments || []);
    } catch {
      message.error("Failed to fetch departments!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4040/department/${id}`, { method: "DELETE" });
      message.success("Department deleted successfully!");
      setDepartments((prev) => prev.filter((d) => d._id !== id));
      setFilteredDepartments((prev) => prev.filter((d) => d._id !== id));
    } catch {
      message.error("Failed to delete department!");
    }
  };

  // 🧾 Create or Update Department
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const isEditing = Boolean(currentDepartment);
      const url = isEditing
        ? `http://localhost:4040/department/${currentDepartment._id}`
        : "http://localhost:4040/department";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save department");

      message.success(
        isEditing ? "Department updated successfully!" : "Department added successfully!"
      );

      setModalVisible(false);
      setCurrentDepartment(null);
      form.resetFields();
      fetchDepartments();
    } catch {
      message.error("Something went wrong while saving department!");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search & Filter Logic
  useEffect(() => {
    let filtered = [...departments];

    if (searchTerm.trim()) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "All") {
      filtered = filtered.filter((d) => d.type === selectedType);
    }

    setFilteredDepartments(filtered);
  }, [searchTerm, selectedType, departments]);

  if (sessionLoading || loading) {
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
        {/* === SIDEBAR === */}
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
                  Admin Panel
                </Title>
                <Text className="!text-gray-600 !text-sm">{session.fullname}</Text>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 px-5">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg 
                !text-gray-800 hover:!bg-red-100 hover:!text-red-700 
                !font-semibold transition-all duration-200 ${
                  item.path === "/admin/departments" ? "!bg-red-100 !text-red-700" : ""
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: "!text-red-500 !text-xl",
                })}
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </div>

          {!collapsed && (
            <div className="p-4 text-center text-xs !text-red-600 !font-semibold">
              © {new Date().getFullYear()} AssignPad
            </div>
          )}
        </Sider>

        {/* === MAIN CONTENT === */}
        <Layout className="!h-full !overflow-y-auto">
          <Header className="!bg-[#fffafa] !border-b !border-gray-300 flex items-center justify-between px-6 !shadow-md">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-red-600 hover:text-red-700 text-xl"
              >
                {collapsed ? <MenuOutlined /> : <CloseOutlined />}
              </button>
              <Title level={4} className="!mb-0 !text-gray-900 !font-semibold">
                Departments
              </Title>
            </div>
            <Text className="!text-gray-700 !font-semibold">{session.email}</Text>
          </Header>

          <Content className="!p-8 !bg-gray-100 min-h-[calc(100vh-70px)]">
            <Card
              className="!bg-white !border !border-gray-200 !shadow-sm !rounded-2xl"
              title={
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Search departments..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-60"
                    />
                    <Select
                      value={selectedType}
                      onChange={(val) => setSelectedType(val)}
                      className="w-40"
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="All">All Types</Option>
                      <Option value="Engineering">Engineering</Option>
                      <Option value="Pharmacy">Pharmacy</Option>
                      <Option value="Nursing">Nursing</Option>
                      <Option value="Science">Science</Option>
                      <Option value="Computer">Computer</Option>
                    </Select>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!bg-orange-600 hover:!bg-orange-700"
                    onClick={() => {
                      setCurrentDepartment(null);
                      form.resetFields();
                      setModalVisible(true);
                    }}
                  >
                    Add Department
                  </Button>
                </div>
              }
            >
              <Row gutter={[16, 16]} className="mt-4">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={dept._id}>
                      <Card
                        className="!rounded-xl !shadow-md hover:!shadow-lg transition-all duration-200"
                        actions={[
                          <EditOutlined
                            key="edit"
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() => {
                              setCurrentDepartment(dept);
                              form.setFieldsValue(dept);
                              setModalVisible(true);
                            }}
                          />,
                          <Popconfirm
                            title="Are you sure you want to delete this department?"
                            onConfirm={() => handleDelete(dept._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined
                              key="delete"
                              className="text-red-500 hover:text-red-600"
                            />
                          </Popconfirm>,
                        ]}
                      >
                        <Title level={5} className="!text-gray-900 !font-bold">
                          {dept.name}
                        </Title>
                        <p className="text-gray-600 mb-1">
                          <strong>Type:</strong> {dept.type}
                        </p>
                        <p className="text-gray-500 text-sm">
                          <strong>Created:</strong>{" "}
                          {new Date(dept.createdAt).toLocaleDateString()}
                        </p>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500 py-8">
                    No departments found.
                  </div>
                )}
              </Row>
            </Card>
          </Content>
        </Layout>
      </Layout>

      {/* === SINGLE FORM MODAL (Add / Edit) === */}
      <Modal
        title={currentDepartment ? "Edit Department" : "Add Department"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setCurrentDepartment(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Department Name"
            name="name"
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Department Type"
            name="type"
            rules={[{ required: true, message: "Please select department type" }]}
          >
            <Select placeholder="Select department type">
              <Option value="Engineering">Engineering</Option>
              <Option value="Pharmacy">Pharmacy</Option>
              <Option value="Nursing">Nursing</Option>
              <Option value="Science">Science</Option>
              <Option value="Computer">Computer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-orange-600 hover:!bg-orange-700"
            >
              {currentDepartment ? "Update Department" : "Add Department"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDepartments;
