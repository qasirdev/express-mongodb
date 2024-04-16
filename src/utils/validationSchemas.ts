export const createUserValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: 'username is required'
    },
    isLength: {
      options: { min: 2, max:8 },
      errorMessage: 'username must be between 2 and 8 characters long'
    },
    isString:{
      errorMessage: "username should be a string"
    }
  },
  displayName: {
    notEmpty: {
      errorMessage: 'display name is required'
    }
  }
}
