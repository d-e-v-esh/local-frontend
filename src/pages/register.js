import React, { useState, useReducer } from "react";
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
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";

import REGISTER from "../graphql/mutations/register";

const theme = createTheme();

const ACTIONS = {
  EMAIL_ERROR: "emailError",
  USERNAME_ERROR: "usernameError",
  PASSWORD_ERROR: "passwordError",
  RESET_FORM: "resetForm",
};

const initialState = {
  isUsernameError: false,
  isEmailError: false,
  isPasswordError: false,
  usernameErrorMessage: "",
  emailErrorMessage: "",
  passwordErrorMessage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.EMAIL_ERROR:
      return {
        ...state,
        isEmailError: true,
        emailErrorMessage: action.payload.errorMessage,
      };

    case ACTIONS.USERNAME_ERROR:
      return {
        ...state,
        isUsernameError: true,
        usernameErrorMessage: action.payload.errorMessage,
      };

    case ACTIONS.PASSWORD_ERROR:
      return {
        ...state,
        isPasswordError: true,
        passwordErrorMessage: action.payload.errorMessage,
      };

    case ACTIONS.RESET_FORM:
      return {
        isUsernameError: false,
        isEmailError: false,
        isPasswordError: false,
        usernameErrorMessage: "",
        emailErrorMessage: "",
        passwordErrorMessage: "",
      };
  }
};

const Register = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER);

  const [state, dispatch] = useReducer(reducer, initialState);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch({ type: ACTIONS.RESET_FORM });
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");

    const response = await register({
      variables: {
        userInfo: { username, email, password, fullName: "fullNameRegister" },
      },
    });

    if (response.data?.register.errors) {
      // if we get error then turn the input fields red

      const errorMapped = toErrorMap(response.data.register.errors);

      if (errorMapped.email) {
        dispatch({
          type: ACTIONS.EMAIL_ERROR,
          payload: { errorMessage: errorMapped.email },
        });
      }

      if (errorMapped.password) {
        dispatch({
          type: ACTIONS.PASSWORD_ERROR,
          payload: { errorMessage: errorMapped.password },
        });
      }

      if (errorMapped.username) {
        dispatch({
          type: ACTIONS.USERNAME_ERROR,
          payload: { errorMessage: errorMapped.username },
        });
      }
    } else if (response.data?.register.user) {
      console.log("Account Created");
      dispatch({ type: ACTIONS.RESET_FORM });
      router.push("/");
    }
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
            Register
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <TextField
                  id="username"
                  label="Username"
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  autoFocus
                  error={state.isUsernameError}
                  helperText={state.usernameErrorMessage}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  error={state.isEmailError}
                  helperText={state.emailErrorMessage}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  autoComplete="new-password"
                  name="password"
                  type="password"
                  required
                  fullWidth
                  error={state.isPasswordError}
                  helperText={state.passwordErrorMessage}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
