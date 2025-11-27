"use client";
import React, { useState } from "react";
import { Card, Typography, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Password } = Input;

const StudentSettings = () => {
  const [file, setFile] = useState(null);

  const handleUpload = (file) => {
    setFile(file);
    message.success(`${file.name} selected`);
    return false; // prevent auto upload
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Title level={2} className="!text-gray-900 !font-bold mb-6">
        Student Settings
      </Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Update Details Section */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-gray-200">
          <Title level={4} className="!mb-4 !text-gray-800">
            Update Details
          </Title>
          <div className="flex flex-col space-y-4">
            <Input placeholder="Full Name" className="!rounded-lg !mt-4" />
            <Input placeholder="Email" className="!rounded-lg !mt-4" />
            <Input placeholder="Phone Number" className="!rounded-lg !mt-4" />
            <Button type="primary" className="!bg-red-600 hover:!bg-red-700 !mt-4">
              Update Details
            </Button>
          </div>
        </Card>

        {/* Change Password Section */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-gray-200">
          <Title level={4} className="!mb-4 !text-gray-800">
            Change Password
          </Title>
          <div className="flex flex-col space-y-4">
            <Password placeholder="Current Password" className="!rounded-lg" />
            <Password placeholder="New Password" className="!rounded-lg" />
            <Password placeholder="Confirm New Password" className="!rounded-lg" />
            <Button type="primary" className="!bg-red-600 hover:!bg-red-700">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Profile Picture Upload Section */}
        <Card className="p-6 rounded-3xl shadow-lg bg-white border border-gray-200">
          <Title level={4} className="!mb-4 !text-gray-800">
            Profile Picture
          </Title>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <Upload
              beforeUpload={handleUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />} className="!bg-red-50 !text-red-600 hover:!bg-red-100">
                Upload New Picture
              </Button>
            </Upload>
            {file && (
              <Button type="primary" className="!bg-red-600 hover:!bg-red-700">
                Save Picture
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentSettings;
