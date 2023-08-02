import { StudentInterface } from 'interfaces/student';
import { GetQueryInterface } from 'interfaces';

export interface MarksInterface {
  id?: string;
  subject: string;
  score: number;
  student_id?: string;
  created_at?: any;
  updated_at?: any;

  student?: StudentInterface;
  _count?: {};
}

export interface MarksGetQueryInterface extends GetQueryInterface {
  id?: string;
  subject?: string;
  student_id?: string;
}
