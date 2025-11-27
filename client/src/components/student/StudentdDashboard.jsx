"use client";
import React, { useContext, useEffect, useState } from "react";
import { Layout, Card, Skeleton, Typography } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Context from "../../utils/Context";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const sidebarItems = [
  { icon: <DashboardOutlined />, label: "Dashboard", path: "/student/dashboard" },
  { icon: <BookOutlined />, label: "My Courses", path: "/student/courses" },
  { icon: <FileTextOutlined />, label: "Assignments", path: "/student/assignments" },
  { icon: <TrophyOutlined />, label: "Achievements", path: "/student/achievements" },
  { icon: <SettingOutlined />, label: "Settings", path: "/student/settings" },
];

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  console.log("Context session:", session);
  console.log("Context loading:", sessionLoading);

  // Redirect if not student after context finishes loading
  useEffect(() => {
    if (!sessionLoading && (!session || session.role !== "student")) {
      navigate("/");
    }
  }, [session, sessionLoading, navigate]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[90vw] sm:w-[600px] p-6 rounded-2xl shadow-md">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  if (!session || session.role !== "student") return null;

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

          {/* Sidebar Menu */}
          <div className="flex flex-col gap-2 px-5">
            {sidebarItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg
                  !text-gray-800 hover:!bg-red-100 hover:!text-red-700
                  !font-semibold transition-all duration-200"
                style={{ fontSize: 16 }}
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
            <Text className="!text-gray-700 !font-semibold">
              {session.email}
            </Text>
          </Header>

          {/* Dashboard Content */}
          <Content className="!p-8 !bg-gray-100 min-h-[calc(100vh-70px)] transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <BookOutlined />,
                  title: "My Courses",
                  desc: "You’re enrolled in 5 courses",
                },
                {
                  icon: <FileTextOutlined />,
                  title: "Assignments",
                  desc: "3 pending assignments",
                },
                {
                  icon: <TrophyOutlined />,
                  title: "Achievements",
                  desc: "2 new badges earned",
                },
                {
                  icon: <SettingOutlined />,
                  title: "Profile Settings",
                  desc: "Manage your account preferences",
                },
              ].map((card, i) => (
                <Card
                  key={i}
                  hoverable
                  variant="borderless"
                  className="!bg-white !border !border-gray-200 !shadow-sm !rounded-2xl hover:!shadow-lg transition-all"
                >
                  {React.cloneElement(card.icon, {
                    className: "!text-red-600 !text-3xl !mb-3",
                  })}
                  <h3 className="!text-gray-900 !font-semibold !mb-1">
                    {card.title}
                  </h3>
                  <p className="!text-gray-600 !text-sm">{card.desc}</p>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center !text-red-600 !text-sm !font-semibold">
              🎓 Empowering Students with{" "}
              <span className="!font-extrabold">AsignPad</span>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default StudentDashboard;
