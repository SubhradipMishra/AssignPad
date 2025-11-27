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
  Spin,
} from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  ApartmentOutlined,
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

const AdminAddUser = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // 🔹 Departments State
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  // 🔐 Session Validation
  useEffect(() => {
    if (sessionLoading === false) {
      if (!session || session.role !== "admin") navigate("/");
    }
  }, [sessionLoading, session, navigate]);

  useEffect(() => {
    if (session) {
      fetchUsers();
      fetchDepartments();
    }
  }, [session]);

  // 🧾 Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4040/auth/allUsers");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch {
      message.error("Failed to fetch users!");
    } finally {
      setLoading(false);
    }
  };

  // 🏢 Fetch Departments
  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const res = await fetch("http://localhost:4040/department");
      if (!res.ok) throw new Error("Failed to fetch departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch {
      message.error("Failed to fetch departments!");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // 🗑️ Delete User
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4040/auth/${id}`, {
  method: "DELETE",
  credentials: "include", // <-- correct key and value
});

      message.success("User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      message.error("Failed to delete user!");
    }
  };

  // 💾 Add or Update User
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const isEditing = Boolean(currentUser);
      const url = isEditing
        ? `http://localhost:4040/auth/${currentUser._id}`
        : "http://localhost:4040/auth/signup";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save user");

      message.success(
        isEditing
          ? "User updated successfully!"
          : "User added successfully! A default password has been sent to the user’s email. Please advise them to change it within 24 hours."
      );
      setModalVisible(false);
      setCurrentUser(null);
      form.resetFields();
      fetchUsers();
    } catch {
      message.error("Something went wrong while saving user!");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search & Filter Logic
  useEffect(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      filtered = filtered.filter((u) =>
        u.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== "All") {
      filtered = filtered.filter((u) => u.role === selectedRole.toLowerCase());
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

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
                  item.path === "/admin/add-user" ? "!bg-red-100 !text-red-700" : ""
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
                Manage Users
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
                      placeholder="Search users..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-60"
                    />
                    <Select
                      value={selectedRole}
                      onChange={(val) => setSelectedRole(val)}
                      className="w-40"
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="All">All Roles</Option>
                      <Option value="admin">Admin</Option>
                      <Option value="professor">Professor</Option>
                      <Option value="student">Student</Option>
                      <Option value="hod">HOD</Option>
                    </Select>
                  </div>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="!bg-orange-600 hover:!bg-orange-700"
                    onClick={() => {
                      setCurrentUser(null);
                      form.resetFields();
                      setModalVisible(true);
                    }}
                  >
                    Add User
                  </Button>
                </div>
              }
            >
              <Row gutter={[16, 16]} className="mt-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={user._id}>
                      <Card
                        className="!rounded-xl !shadow-md hover:!shadow-lg transition-all duration-200"
                        actions={[
                          <EditOutlined
                            key="edit"
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() => {
                              setCurrentUser(user);
                              form.setFieldsValue(user);
                              setModalVisible(true);
                            }}
                          />,
                          <Popconfirm
                            title="Are you sure you want to delete this user?"
                            onConfirm={() => handleDelete(user._id)}
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
                        <Title level={5} className="!text-gray-900 !font-bold capitalize">
                          {user.fullname}
                        </Title>
                        <p className="text-gray-600 mb-1">
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Phone:</strong> {user.phoneno}
                        </p>
                        <p className="text-gray-600 mb-1 capitalize">
                          <strong>Role:</strong> {user.role}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Department:</strong> {user.department}
                        </p>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500 py-8">
                    No users found.
                  </div>
                )}
              </Row>
            </Card>
          </Content>
        </Layout>
      </Layout>

      {/* === ADD / EDIT USER MODAL === */}
      <Modal
        title={currentUser ? "Edit User" : "Add User"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setCurrentUser(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneno"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Enter valid 10-digit phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select
              placeholder="Select department"
              loading={departmentsLoading}
              disabled={departmentsLoading}
              notFoundContent={
                departmentsLoading ? <Spin size="small" /> : "No departments found"
              }
            >
              {departments.map((dept) => (
                <Option key={dept._id} value={dept.name}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="professor">Professor</Option>
              <Option value="student">Student</Option>
              <Option value="hod">HOD</Option>
            </Select>
          </Form.Item>

          {!currentUser && (
            <Text type="secondary">
              A default password will be sent to the user’s email. Please advise them to
              change it within 24 hours.
            </Text>
          )}

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="!bg-orange-600 hover:!bg-orange-700"
            >
              {currentUser ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAddUser;
