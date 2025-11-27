"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  Card,
  Typography,
  Tag,
  Button,
  Skeleton,
  Descriptions,
  message,
  Timeline,
} from "antd";
import {
  ArrowLeftOutlined,
  FilePdfOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Context from "../../utils/Context";
import axios from "axios";

const { Title, Text } = Typography;

const statusColors = {
  draft: "orange",
  submitted: "blue",
  approved: "green",
  rejected: "red",
};

const statusIcons = {
  draft: <ClockCircleOutlined style={{ color: "orange" }} />,
  submitted: <ExclamationCircleOutlined style={{ color: "blue" }} />,
  approved: <CheckCircleOutlined style={{ color: "green" }} />,
  rejected: <CloseCircleOutlined style={{ color: "red" }} />,
};

const StudentAssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, sessionLoading } = useContext(Context);

  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [showPdf, setShowPdf] = useState(true);

  // Dynamic timeline based on assignment status
  const getTimelineItems = () => {
    if (!assignment) return [];
    const base = [
      {
        color: "cyan",
        dot: <ClockCircleOutlined style={{ color: "cyan" }} />,
        children: "Assignment created",
      },
      {
        color: "blue",
        dot: <ExclamationCircleOutlined style={{ color: "blue" }} />,
        children: "Submitted to Professor",
      },
    ];

    switch (assignment.status) {
      case "draft":
        return [
          ...base,
          { color: "orange", dot: <ClockCircleOutlined />, children: "Draft saved" },
        ];
      case "submitted":
        return [
          ...base,
          { color: "blue", dot: <ExclamationCircleOutlined />, children: "Waiting for review" },
        ];
      case "approved":
        return [
          ...base,
          { color: "green", dot: <CheckCircleOutlined />, children: "Approved by Professor" },
        ];
      case "rejected":
        return [
          ...base,
          { color: "red", dot: <CloseCircleOutlined />, children: "Rejected by Professor" },
        ];
      default:
        return base;
    }
  };

  useEffect(() => {
    if (!sessionLoading && (!session || session.role !== "student")) {
      navigate("/");
    }
  }, [sessionLoading, session, navigate]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4040/assignment/${id}`, {
          withCredentials: true,
        });
        setAssignment(res.data.assignment || null);
      } catch (err) {
        message.error("Failed to fetch details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-50">
        <Card className="w-[90vw] sm:w-[600px] p-8 rounded-3xl shadow-2xl border border-gray-300 bg-white">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  if (!assignment) {
    return (
      <Card className="w-[90vw] sm:w-[600px] p-8 rounded-3xl shadow-xl border border-red-300 bg-red-50">
        <Text type="danger" className="text-lg font-semibold">
          Assignment not found.
        </Text>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          className="mt-6"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-8 animate-fadeIn">

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="!text-red-700 !font-bold mb-8 ml-6 hover:underline text-lg"
      >
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT — DETAILS */}
        <Card className="p-8 rounded-3xl shadow-2xl border border-gray-200 bg-gradient-to-br from-white to-red-50">
          <Title
            level={2}
            className="!font-extrabold !text-gray-900 mb-6 drop-shadow"
          >
            {assignment.title}
          </Title>

          <Descriptions
            column={1}
            bordered
            size="middle"
            className="mb-8 rounded-xl border-red-300 bg-white shadow"
          >
            <Descriptions.Item label="Type">{assignment.category}</Descriptions.Item>

            <Descriptions.Item label="Submitted To">
              {assignment.submittedTo?.fullname ||
                assignment.submittedTo?.name ||
                assignment.submittedTo ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              <Tag
                color={statusColors[assignment.status]}
                icon={statusIcons[assignment.status]}
                className="!text-lg !font-semibold px-3 py-1 rounded-lg shadow"
              >
                {assignment.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Created At">
              {new Date(assignment.createdAt).toLocaleString()}
            </Descriptions.Item>

            <Descriptions.Item label="Description" className="whitespace-pre-wrap">
              {assignment.description}
            </Descriptions.Item>

            <Descriptions.Item label="PDF File">
              {assignment.path ? (
                <Button
                  icon={<FilePdfOutlined />}
                  type="primary"
                  className="!bg-red-600 hover:!bg-red-700"
                  onClick={() => setShowPdf(!showPdf)}
                >
                  {showPdf ? "Hide Viewer" : "Show Viewer"}
                </Button>
              ) : (
                "Not uploaded"
              )}
            </Descriptions.Item>
          </Descriptions>

          <Title level={4} className="!font-extrabold !text-gray-800 mb-4">
            Activity Timeline
          </Title>

          <Timeline
            mode="left"
            items={getTimelineItems()}
            className="!border-l-4 !border-red-600 
                       !rounded-xl !p-4 shadow-xl 
                       bg-gradient-to-br from-white to-red-100"
          />
        </Card>

        {/* RIGHT — PDF VIEWER */}
        {showPdf && (
          <Card className="p-0 rounded-3xl shadow-2xl border border-gray-300 bg-white animate-slideIn">
            {assignment.path ? (
              <iframe
                src={assignment.path}
                className="w-full h-[80vh] rounded-3xl"
                title="PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-[80vh]">
                <Text type="secondary">No PDF uploaded</Text>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentDetails;
