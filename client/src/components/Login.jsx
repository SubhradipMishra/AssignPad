"use client";
import React, { useState, useContext } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Context from "../utils/Context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setSession } = useContext(Context);
  const navigate = useNavigate();
  const [form] = Form.useForm(); // ✅ ensure we control the form

  const onFinish = async (values) => {
    console.log("🧩 Login form submitted with values:", values); // debug check

    if (!values.email || !values.password) {
      message.warning("Please fill in both email and password!");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:4040/auth/login",
        values,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }, // ✅ ensure backend reads it properly
        }
      );

      message.success("✅ Login successful!");

      // Fetch updated session after successful login
      const sessionResponse = await axios.get("http://localhost:4040/auth/session", {
        withCredentials: true,
      });
      setSession(sessionResponse.data);

      // Redirect user based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error("🔥 Login error:", err.response || err);
      const errorMessage = err.response?.data?.message || "Login failed!";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      <Card
        bordered={false}
        className="relative z-10 w-[90vw] sm:w-[400px] bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="AsignPad Logo"
            className="w-20 h-20 object-contain mb-2"
          />
          <h2 className="text-xl font-bold text-gray-800 text-center tracking-tight">
            Asign<span className="text-red-600">Pad</span>
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Streamlined Assignment Approval System
          </p>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            label={<span className="text-gray-700 font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-red-600 mr-2" />}
              placeholder="Enter your email"
              size="large"
              autoComplete="email"
              className="rounded-md focus:!border-red-600 hover:!border-red-500 !border-gray-300 transition-all duration-300 text-gray-800"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-red-600 mr-2" />}
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
              className="rounded-md focus:!border-red-600 hover:!border-red-500 !border-gray-300 transition-all duration-300 text-gray-800"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full text-white font-semibold !py-3 rounded-md text-lg !bg-red-600 hover:!bg-red-500 focus:!bg-red-700 !border-none transition-all duration-300"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Form.Item>

          <div className="text-center mt-2">
            <a
              href="#"
              className="text-sm text-red-600 hover:text-red-500 hover:underline"
            >
              Forgot your password? Click here
            </a>
          </div>
        </Form>

        <div className="text-center mt-8 text-gray-600 text-sm">
          © {new Date().getFullYear()} —{" "}
          <span className="text-red-600 font-semibold">AsignPad</span>
        </div>
      </Card>
    </div>
  );
}
