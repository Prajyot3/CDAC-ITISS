export interface MCQOption {
  key: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface Question {
  id: string;
  moduleId: string;
  sourcePdf: string;
  sourceSection?: string;
  sourceQuestionNumber: string;
  pageNumber: number;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  correctAnswerText: string;
  explanation: string;
  topic: string;
  diagram?: string | null;
}

export interface PDFSourceAudit {
  filename: string;
  totalPages: number;
  questionsExtracted: number;
  questionsImported: number;
  sections?: { name: string; count: number }[];
  answerExtractionMethod: string;
}

export interface ExtractionAuditReport {
  module: string;
  moduleId: string;
  totalExtracted: number;
  totalImported: number;
  status: string;
  sources: PDFSourceAudit[];
  topicBreakdown: Record<string, number>;
}

