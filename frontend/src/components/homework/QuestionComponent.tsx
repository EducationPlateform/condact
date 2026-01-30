import React from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { Question } from "../../types/api";

interface QuestionComponentProps {
  question: Question;
  index: number;
  value: any;
  onChange: (value: any) => void;
  showAnswer?: boolean;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  index,
  value,
  onChange,
  showAnswer = false,
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            >
              {question.options?.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {showAnswer && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Correct Answer: {question.correctAnswer}
              </Typography>
            )}
          </FormControl>
        );

      case "true-false":
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
              />
            </RadioGroup>
            {showAnswer && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Correct Answer: {question.correctAnswer}
              </Typography>
            )}
          </FormControl>
        );

      case "text":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your answer"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Question {index + 1} ({question.points} points)
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      {renderQuestion()}
    </Box>
  );
};

export default QuestionComponent;
