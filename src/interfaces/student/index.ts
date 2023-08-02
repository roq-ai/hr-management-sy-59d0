import { EvaluationInterface } from 'interfaces/evaluation';
import { MarksInterface } from 'interfaces/marks';
import { VacationInterface } from 'interfaces/vacation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface StudentInterface {
  id?: string;
  name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  evaluation?: EvaluationInterface[];
  marks?: MarksInterface[];
  vacation?: VacationInterface[];
  user?: UserInterface;
  _count?: {
    evaluation?: number;
    marks?: number;
    vacation?: number;
  };
}

export interface StudentGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  user_id?: string;
}
