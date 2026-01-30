import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { Assignment } from "@mui/icons-material";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import HomeworkForm from "../../components/homework/HomeworkForm";
import { homeworkService } from "../../services/homeworkService";
import { lectureService } from "../../services/lectureService";
import { Homework, Lecture } from "../../types/api";

const StudentHomework: React.FC = () => {
  const [homeworks, setHomeworks] = useState<
    { homework: Homework; lecture: Lecture }[]
  >([]);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const groups = await import("../../services/groupService").then((m) =>
          m.groupService.getAll(),
        );
        const allHomeworks: { homework: Homework; lecture: Lecture }[] = [];

        for (const group of groups) {
          try {
            const lectures = await lectureService.getByGroup(group._id);
            for (const lecture of lectures) {
              try {
                const homework = await homeworkService.getByLecture(
                  lecture._id,
                );
                allHomeworks.push({ homework, lecture });
              } catch (err) {
                // No homework for this lecture
              }
            }
          } catch (err) {
            // Skip
          }
        }

        setHomeworks(allHomeworks);
      } catch (error) {
        console.error("Failed to fetch homeworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (selectedHomework) {
    return (
      <Layout>
        <Button onClick={() => setSelectedHomework(null)} sx={{ mb: 2 }}>
          Back to Homework List
        </Button>
        <HomeworkForm
          homework={selectedHomework}
          onSubmit={() => {
            setSelectedHomework(null);
            // Refresh list
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        My Homework
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {homeworks.map((item) => (
          <Grid item xs={12} md={6} key={item.homework._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.homework.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lecture:{" "}
                  {typeof item.lecture === "object"
                    ? item.lecture.title
                    : "Unknown"}
                </Typography>
                {item.homework.dueDate && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Due: {new Date(item.homework.dueDate).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {item.homework.questions.length} questions • Max Score:{" "}
                  {item.homework.maxScore}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Assignment />}
                  onClick={() => setSelectedHomework(item.homework)}
                >
                  Start Homework
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {homeworks.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No homework available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default StudentHomework;
