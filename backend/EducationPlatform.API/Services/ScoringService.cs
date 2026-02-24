using System.Text.Json;
using EducationPlatform.Domain.Entities;
using EducationPlatform.Domain.Enums;

namespace EducationPlatform.API.Services;

public interface IScoringService
{
    decimal CalculateScore(Homework homework, Dictionary<string, object> answers);
    decimal CalculateScore(Exam exam, Dictionary<string, object> answers);
}

public class ScoringService : IScoringService
{
    public decimal CalculateScore(Homework homework, Dictionary<string, object> answers)
    {
        return CalculateScoreInternal(homework.Questions, answers);
    }

    public decimal CalculateScore(Exam exam, Dictionary<string, object> answers)
    {
        return CalculateScoreInternal(exam.Questions, answers);
    }

    private decimal CalculateScoreInternal(string questionsJson, Dictionary<string, object> answers)
    {
        try
        {
            var questions = JsonSerializer.Deserialize<List<QuestionDto>>(questionsJson) ?? new List<QuestionDto>();
            decimal totalScore = 0;

            for (int i = 0; i < questions.Count; i++)
            {
                var question = questions[i];
                var indexKey = i.ToString();
                
                // Try to find the answer by Question ID first, then by its index string
                object? answer = null;
                if (!string.IsNullOrEmpty(question.Id) && answers.ContainsKey(question.Id))
                {
                    answer = answers[question.Id];
                }
                else if (answers.ContainsKey(indexKey))
                {
                    answer = answers[indexKey];
                }

                if (answer == null)
                {
                    continue;
                }

                var isCorrect = false;

                if (question.Type == QuestionType.MultipleChoice || question.Type == QuestionType.TrueFalse)
                {
                    var correctAnswer = question.CorrectAnswer;
                    if (correctAnswer is JsonElement jsonElement)
                    {
                        if (jsonElement.ValueKind == JsonValueKind.Array)
                        {
                            var correctAnswers = jsonElement.EnumerateArray().Select(e => e.GetString()).ToList();
                            if (answer is string answerStr)
                            {
                                isCorrect = correctAnswers.Contains(answerStr);
                            }
                            else if (answer is JsonElement answerJson && answerJson.ValueKind == JsonValueKind.Array)
                            {
                                var answerList = answerJson.EnumerateArray().Select(e => e.GetString()).ToList();
                                isCorrect = correctAnswers.SequenceEqual(answerList);
                            }
                        }
                        else
                        {
                            var correctAnswerStr = jsonElement.GetString();
                            isCorrect = answer.ToString() == correctAnswerStr;
                        }
                    }
                    else
                    {
                        isCorrect = answer.ToString() == correctAnswer?.ToString();
                    }
                }
                // Text questions are not auto-scored

                if (isCorrect)
                {
                    // Ensure we award at least 1 point if points is not set, to avoid zero total
                    totalScore += question.Points > 0 ? question.Points : 1;
                }
            }

            return totalScore;
        }
        catch
        {
            return 0;
        }
    }
}

public class QuestionDto
{
    public string Id { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public List<string>? Options { get; set; }
    public object? CorrectAnswer { get; set; }
    public decimal Points { get; set; }
}
