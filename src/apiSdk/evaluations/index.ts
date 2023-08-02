import axios from 'axios';
import queryString from 'query-string';
import { EvaluationInterface, EvaluationGetQueryInterface } from 'interfaces/evaluation';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getEvaluations = async (
  query?: EvaluationGetQueryInterface,
): Promise<PaginatedInterface<EvaluationInterface>> => {
  const response = await axios.get('/api/evaluations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createEvaluation = async (evaluation: EvaluationInterface) => {
  const response = await axios.post('/api/evaluations', evaluation);
  return response.data;
};

export const updateEvaluationById = async (id: string, evaluation: EvaluationInterface) => {
  const response = await axios.put(`/api/evaluations/${id}`, evaluation);
  return response.data;
};

export const getEvaluationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/evaluations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEvaluationById = async (id: string) => {
  const response = await axios.delete(`/api/evaluations/${id}`);
  return response.data;
};
