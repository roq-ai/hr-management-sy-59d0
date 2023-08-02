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
import { getMarksById, updateMarksById } from 'apiSdk/marks';
import { marksValidationSchema } from 'validationSchema/marks';
import { MarksInterface } from 'interfaces/marks';
import { StudentInterface } from 'interfaces/student';
import { getStudents } from 'apiSdk/students';

function MarksEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<MarksInterface>(
    () => (id ? `/marks/${id}` : null),
    () => getMarksById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MarksInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMarksById(id, values);
      mutate(updated);
      resetForm();
      router.push('/marks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MarksInterface>({
    initialValues: data,
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
              label: 'Update Marks',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Marks
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(MarksEditPage);
