import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
} from "@mui/material";
import { VpnKey, Add } from "@mui/icons-material";
import Layout from "../../components/common/Layout";
import { accessService } from "../../services/accessService";
import { lectureService } from "../../services/lectureService";
import { groupService } from "../../services/groupService";
import { Lecture, Group, User } from "../../types/api";
import api from "../../services/api";

const AccessManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [maxViews, setMaxViews] = useState(3);
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAll();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!selectedGroup) {
        setLectures([]);
        return;
      }
      try {
        const data = await lectureService.getByGroup(selectedGroup);
        setLectures(data);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      }
    };
    fetchLectures();
  }, [selectedGroup]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/users/role/student");
        if (response.data.success && response.data.data) {
          setStudents(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleGrantAccess = async () => {
    if (!selectedStudent || !selectedLecture) {
      alert("Please select a student and lecture");
      return;
    }

    try {
      await accessService.grantAccess(
        selectedStudent,
        selectedLecture,
        maxViews,
      );
      alert("Access granted successfully");
      setSelectedStudent("");
      setSelectedLecture("");
    } catch (error) {
      console.error("Failed to grant access:", error);
      alert("Failed to grant access");
    }
  };

  const handleGenerateCode = async () => {
    if (!selectedLecture) {
      alert("Please select a lecture");
      return;
    }

    try {
      const result = await accessService.generateCode(
        selectedLecture,
        maxViews,
      );
      setGeneratedCode(result.code);
    } catch (error) {
      console.error("Failed to generate code:", error);
      alert("Failed to generate access code");
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Access Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grant Access to Student
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  value={selectedGroup}
                  label="Group"
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setSelectedLecture("");
                  }}
                >
                  {groups.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Lecture</InputLabel>
                <Select
                  value={selectedLecture}
                  label="Lecture"
                  onChange={(e) => setSelectedLecture(e.target.value)}
                  disabled={!selectedGroup}
                >
                  {lectures.map((lecture) => (
                    <MenuItem key={lecture._id} value={lecture._id}>
                      {lecture.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={selectedStudent}
                  label="Student"
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Max Views"
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(parseInt(e.target.value) || 3)}
                fullWidth
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleGrantAccess}
                fullWidth
              >
                Grant Access
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generate Access Code
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  value={selectedGroup}
                  label="Group"
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setSelectedLecture("");
                  }}
                >
                  {groups.map((group) => (
                    <MenuItem key={group._id} value={group._id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Lecture</InputLabel>
                <Select
                  value={selectedLecture}
                  label="Lecture"
                  onChange={(e) => setSelectedLecture(e.target.value)}
                  disabled={!selectedGroup}
                >
                  {lectures.map((lecture) => (
                    <MenuItem key={lecture._id} value={lecture._id}>
                      {lecture.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Max Views per Code"
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(parseInt(e.target.value) || 3)}
                fullWidth
              />

              <Button
                variant="contained"
                startIcon={<VpnKey />}
                onClick={handleGenerateCode}
                fullWidth
                disabled={!selectedLecture}
              >
                Generate Code
              </Button>

              {generatedCode && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="h6">Access Code:</Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: "monospace", mt: 1 }}
                  >
                    {generatedCode}
                  </Typography>
                </Alert>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AccessManagement;
