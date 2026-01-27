import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { School, VideoLibrary, Description } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import { useNavigate } from 'react-router-dom';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { Lecture, Group } from '../../types/api';

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        setGroups(groupsData);
        
        const allLectures: Lecture[] = [];
        for (const group of groupsData) {
          try {
            const groupLectures = await lectureService.getByGroup(group._id);
            allLectures.push(...groupLectures);
          } catch (err) {
            // Skip groups without lectures
          }
        }
        setLectures(allLectures);
      } catch (error) {
        console.error('Failed to fetch lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        My Lectures
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {lectures.map((lecture) => (
          <Grid item xs={12} md={6} key={lecture._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {lecture.title}
                </Typography>
                {lecture.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {lecture.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {lecture.isPublished && (
                    <Chip label="Published" color="success" size="small" />
                  )}
                  {lecture.scheduledDate && (
                    <Chip
                      label={`Scheduled: ${new Date(lecture.scheduledDate).toLocaleDateString()}`}
                      size="small"
                    />
                  )}
                  {lecture.pdfFiles && lecture.pdfFiles.length > 0 && (
                    <Chip
                      icon={<Description />}
                      label={`${lecture.pdfFiles.length} PDF(s)`}
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<VideoLibrary />}
                  onClick={() => navigate(`/student/lectures/${lecture._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {lectures.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No lectures available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Lectures;
