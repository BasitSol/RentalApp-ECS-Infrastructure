
export default function validate(values) {
    let errors = {};
    Object.keys(values).forEach((field) => {
        errors = fieldLookup[field](values, errors)
    })
    return errors
}

const NameValidation = (values, errors) => {
    if (!values.name) {
        errors.name = 'Field is Required'
    }
    return errors;
}

const EmailValidation = (values, errors) => {
    if (!values.email) {
        errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }
    return errors;
}

const PasswordValidation = (values, errors) => {
    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be 8 or more characters';
    }
    return errors;
}

const ConfirmPasswordValidation = (values, errors) => {
    if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Password does not match';
    }
    return errors;
}

const RoleValidation = (values, errors) => {
    if (!values.role) {
        errors.role = 'Please select a Role';
    }
    return errors;
}

const LocationValidation = (values, errors) => {
    if (!values.location) {
        errors.location = 'Please select a Location';
    }
    return errors;
}

const ColorValidation = (values, errors) => {
    if (!values.color) {
        errors.color = 'Please select a Color';
    }
    return errors;
}

const ModelValidation = (values, errors) => {
    if (!values.model) {
        errors.model = 'Please select a Model';
    }
    return errors;
}

const fieldLookup = {
    "name": NameValidation,
    "email": EmailValidation,
    "password": PasswordValidation,
    "confirmPassword": ConfirmPasswordValidation,
    "role": RoleValidation,
    "location": LocationValidation,
    "color": ColorValidation,
    "model": ModelValidation,
}
