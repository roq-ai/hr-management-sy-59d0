import axios from 'axios';
import queryString from 'query-string';
import { MarksInterface, MarksGetQueryInterface } from 'interfaces/marks';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMarks = async (query?: MarksGetQueryInterface): Promise<PaginatedInterface<MarksInterface>> => {
  const response = await axios.get('/api/marks', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createMarks = async (marks: MarksInterface) => {
  const response = await axios.post('/api/marks', marks);
  return response.data;
};

export const updateMarksById = async (id: string, marks: MarksInterface) => {
  const response = await axios.put(`/api/marks/${id}`, marks);
  return response.data;
};

export const getMarksById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/marks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMarksById = async (id: string) => {
  const response = await axios.delete(`/api/marks/${id}`);
  return response.data;
};
