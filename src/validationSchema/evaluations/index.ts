import * as yup from 'yup';

export const evaluationValidationSchema = yup.object().shape({
  evaluation_date: yup.date().required(),
  performance_score: yup.number().integer().required(),
  student_id: yup.string().nullable(),
});
