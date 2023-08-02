import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getEvaluationById, updateEvaluationById } from 'apiSdk/evaluations';
import { evaluationValidationSchema } from 'validationSchema/evaluations';
import { EvaluationInterface } from 'interfaces/evaluation';
import { StudentInterface } from 'interfaces/student';
import { getStudents } from 'apiSdk/students';

function EvaluationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<EvaluationInterface>(
    () => (id ? `/evaluations/${id}` : null),
    () => getEvaluationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EvaluationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEvaluationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/evaluations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EvaluationInterface>({
    initialValues: data,
    validationSchema: evaluationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Evaluations',
              link: '/evaluations',
            },
            {
              label: 'Update Evaluation',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Evaluation
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="evaluation_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Evaluation Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.evaluation_date ? new Date(formik.values?.evaluation_date) : null}
              onChange={(value: Date) => formik.setFieldValue('evaluation_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Performance Score"
            formControlProps={{
              id: 'performance_score',
              isInvalid: !!formik.errors?.performance_score,
            }}
            name="performance_score"
            error={formik.errors?.performance_score}
            value={formik.values?.performance_score}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('performance_score', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<StudentInterface>
            formik={formik}
            name={'student_id'}
            label={'Select Student'}
            placeholder={'Select Student'}
            fetcher={getStudents}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/evaluations')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'evaluation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(EvaluationEditPage);
