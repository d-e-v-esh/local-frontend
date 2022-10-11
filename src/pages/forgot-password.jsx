import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { gql, useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { toErrorMap } from "../utils/toErrorMap";
import FORGOT_PASSWORD from "../graphql/mutations/forgotPassword";

const theme = createTheme();

const Login = () => {
  const [forgotPassword, { data, loading, error }] =
    useMutation(FORGOT_PASSWORD);

  const [forgotPasswordEmailError, setForgotPasswordEmailError] =
    useState(false);
  const [forgotPasswordEmailMessage, setForgotPasswordEmailMessage] =
    useState("");

  const router = useRouter();

  const resetErrorStateValues = () => {
    setForgotPasswordEmailError(false);
    setForgotPasswordEmailMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrorStateValues();
    const data = new FormData(event.currentTarget);

    const email = data.get("email");

    const response = await forgotPassword({
      variables: {
        email,
      },
    });

    console.log({ response });

    // if (response.data?.login.errors) {
    //   const errorMapped = toErrorMap(response.data.login.errors);
    //   console.log(toErrorMap(response.data.login.errors));
    //   if (errorMapped.usernameOrEmail) {
    //     setUsernameOrEmailErrorMessage(errorMapped.usernameOrEmail);
    //     setIsUsernameOrEmailError(true);
    //   }

    //   if (errorMapped.password) {
    //     setPasswordErrorMessage(errorMapped.password);
    //     setIsPasswordError(true);
    //   }
    // } else if (response.data?.login.user) {
    //   if (typeof router.query.next === "string") {
    //     router.push(router.query.next);
    //   } else {
    //     console.log("Email Sent Successfully");
    //     resetErrorStateValues();
    //     router.push("/");
    //   }
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={forgotPasswordEmailError}
              helperText={forgotPasswordEmailMessage}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Send Email
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
