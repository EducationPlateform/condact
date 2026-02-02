import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '../../types/api';

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        
        const allLectures: Lecture[] = [];
        for (const group of groupsData) {
          try {
            const groupLectures = await lectureService.getByGroup(group._id);
            allLectures.push(...groupLectures);
          } catch (err) {
            // Skip
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      try {
        await lectureService.delete(id);
        setLectures(lectures.filter((l) => l._id !== id));
      } catch (error) {
        console.error('Failed to delete lecture:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Lectures</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/teacher/lectures/new')}
        >
          Create Lecture
        </Button>
      </Box>

      <Grid container spacing={3}>
        {lectures.map((lecture) => (
          <Grid item xs={12} md={6} key={lecture._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{lecture.title}</Typography>
                {lecture.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {lecture.description}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Published: {lecture.isPublished ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/teacher/lectures/${lecture._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(lecture._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Lectures;
