import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import SecureVideoPlayer from "../../components/video/SecureVideoPlayer";
import { lectureService } from "../../services/lectureService";
import { videoService } from "../../services/videoService";
import { accessService } from "../../services/accessService";
import { Lecture, Video, StudentAccess } from "../../types/api";

const VideoViewer: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [access, setAccess] = useState<StudentAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!lectureId) return;

      try {
        const lectureData = await lectureService.getById(lectureId);
        setLecture(lectureData);

        if (lectureData.videoId) {
          const videoData = await videoService.getById(
            typeof lectureData.videoId === "string"
              ? lectureData.videoId
              : (lectureData.videoId as any).id || (lectureData.videoId as any)._id,
          );
          setVideo(videoData);
        }

        try {
          const accessData = await accessService.checkAccess(lectureId);
          setAccess(accessData);
        } catch (err) {
          // No access yet
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lectureId]);

  const handleViewRecorded = async () => {
    if (!lectureId) return;
    try {
      const accessData = await accessService.checkAccess(lectureId);
      setAccess(accessData);
    } catch (err) {
      console.error("Failed to refresh access:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!lecture || !video) {
    return (
      <Layout>
        <Typography>Video not found</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/student/lectures/${lectureId}`)}
        sx={{ mb: 2 }}
      >
        Back to Lecture
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {lecture.title}
        </Typography>

        {access && (
          <SecureVideoPlayer
            videoId={video.id || (video as any)._id}
            lectureId={lecture.id || (lecture as any)._id}
            maxViews={access.maxViews}
            currentViews={access.currentViews}
            onViewRecorded={handleViewRecorded}
            useDrm={video.securityConfig?.drmEnabled || false}
          />
        )}
      </Paper>
    </Layout>
  );
};

export default VideoViewer;
