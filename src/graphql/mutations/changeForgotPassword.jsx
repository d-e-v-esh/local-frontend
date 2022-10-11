import { gql } from "@apollo/client";

const CHANGE_FORGOT_PASSWORD = gql`
  mutation ChangeForgotPassword($token: String!, $newPassword: String!) {
    changeForgotPassword(token: $token, newPassword: $newPassword) {
      user {
        email
        fullName
        username
      }
      errors {
        field
        message
      }
    }
  }
`;

export default CHANGE_FORGOT_PASSWORD;
