export const createUserValidationSchema = {
  name: {
    notEmpty: {
      errorMessage: 'Name is required'
    },
    isLength: {
      options: { min: 2, max:8 },
      errorMessage: 'Name must be between 2 and 8 characters long'
    },
    isString:{
      errorMessage: "Name should be a string"
    }
  },
  displayName: {
    notEmpty: {
      errorMessage: 'display name is required'
    }
  }
}