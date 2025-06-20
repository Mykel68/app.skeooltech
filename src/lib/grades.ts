// utils/grades.ts
export const getRemarkFromGrade = (grade: string) => {
  switch (grade) {
    case "A":
      return "Excellent";
    case "B":
      return "Very Good";
    case "C":
      return "Good";
    case "D":
      return "Fair";
    default:
      return "Needs Improvement";
  }
};

export const getGradeColor = (score: number, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 70) return "text-blue-600";
  if (percentage >= 60) return "text-yellow-600";
  if (percentage >= 50) return "text-orange-600";
  return "text-red-600";
};

export const getGradeBadgeVariant = (score: number, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "default";
  if (percentage >= 70) return "secondary";
  if (percentage >= 60) return "outline";
  return "destructive";
};

export const getGrade = (score: number, maxScore = 100) => {
  const percentage = (score / maxScore) * 100;
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};
