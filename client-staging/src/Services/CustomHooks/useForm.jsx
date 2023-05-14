import { useEffect, useState } from 'react';

const useForm = (callback, validate, defaultValues = {}) => {

  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [eventObj, setEventObj] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triedOnce, setTriedOnce] = useState(false)

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(eventObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const handleSubmitValidation = (event) => {
    if (event) event.preventDefault();
    setEventObj(event);
    setErrors(validate(values))
    setIsSubmitting(true);
    setTriedOnce(true);
  };

  const handleChangeValidation = (event) => {
    triedOnce && setErrors(validate({ ...values, [event.target.name]: event.target.value }));
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
    setIsSubmitting(false);
  };

  return {
    handleChangeValidation,
    handleSubmitValidation,
    values,
    errors,
  }
};

export default useForm;