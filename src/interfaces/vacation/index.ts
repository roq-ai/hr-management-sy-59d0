import { StudentInterface } from 'interfaces/student';
import { GetQueryInterface } from 'interfaces';

export interface VacationInterface {
  id?: string;
  start_date: any;
  end_date: any;
  student_id?: string;
  created_at?: any;
  updated_at?: any;

  student?: StudentInterface;
  _count?: {};
}

export interface VacationGetQueryInterface extends GetQueryInterface {
  id?: string;
  student_id?: string;
}
