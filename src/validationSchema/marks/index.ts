import * as yup from 'yup';

export const marksValidationSchema = yup.object().shape({
  subject: yup.string().required(),
  score: yup.number().integer().required(),
  student_id: yup.string().nullable(),
});
