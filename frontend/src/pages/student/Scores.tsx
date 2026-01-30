import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Layout from "../../components/common/Layout";
import Loading from "../../components/common/Loading";
import { Score } from "../../types/api";
import api from "../../services/api";

const Scores: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get("/admin/scores");
        if (response.data.success && response.data.data) {
          setScores(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
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
        My Scores
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Lecture</TableCell>
              <TableCell align="right">Homework Score</TableCell>
              <TableCell align="right">Exam Score</TableCell>
              <TableCell align="right">Total Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score._id}>
                <TableCell>
                  {typeof score.lectureId === "object"
                    ? score.lectureId.title
                    : "Unknown"}
                </TableCell>
                <TableCell align="right">{score.homeworkScore || 0}</TableCell>
                <TableCell align="right">{score.examScore || 0}</TableCell>
                <TableCell align="right">
                  <strong>{score.totalScore}</strong>
                </TableCell>
              </TableRow>
            ))}
            {scores.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No scores available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default Scores;
