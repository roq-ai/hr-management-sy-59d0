import { StudentInterface } from 'interfaces/student';
import { GetQueryInterface } from 'interfaces';

export interface EvaluationInterface {
  id?: string;
  evaluation_date: any;
  performance_score: number;
  student_id?: string;
  created_at?: any;
  updated_at?: any;

  student?: StudentInterface;
  _count?: {};
}

export interface EvaluationGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_id?: string;
}
