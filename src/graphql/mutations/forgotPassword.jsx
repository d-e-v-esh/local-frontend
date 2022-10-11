import { gql } from "@apollo/client";

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export default FORGOT_PASSWORD;
