export interface ExamCreate {
  title: string;
  exam_date: string;  // Date in ISO format
  priority: number;
}

export interface ExamOut extends ExamCreate {
  id: string;
  created_at: string;  // Created timestamp in ISO format
}
