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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createMarks } from 'apiSdk/marks';
import { marksValidationSchema } from 'validationSchema/marks';
import { StudentInterface } from 'interfaces/student';
import { getStudents } from 'apiSdk/students';
import { MarksInterface } from 'interfaces/marks';

function MarksCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MarksInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMarks(values);
      resetForm();
      router.push('/marks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MarksInterface>({
    initialValues: {
      subject: '',
      score: 0,
      student_id: (router.query.student_id as string) ?? null,
    },
    validationSchema: marksValidationSchema,
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
              label: 'Marks',
              link: '/marks',
            },
            {
              label: 'Create Marks',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Marks
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.subject}
            label={'Subject'}
            props={{
              name: 'subject',
              placeholder: 'Subject',
              value: formik.values?.subject,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Score"
            formControlProps={{
              id: 'score',
              isInvalid: !!formik.errors?.score,
            }}
            name="score"
            error={formik.errors?.score}
            value={formik.values?.score}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('score', Number.isNaN(valueNumber) ? 0 : valueNumber)
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
              onClick={() => router.push('/marks')}
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
    entity: 'marks',
    operation: AccessOperationEnum.CREATE,
  }),
)(MarksCreatePage);
