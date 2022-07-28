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
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { toErrorMap } from "../utils/toErrorMap";

import REGISTER from "../graphql/mutations/register";

const theme = createTheme();

const Register = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER);

  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const router = useRouter();

  const resetErrorStateValues = () => {
    setIsUsernameError(false);
    setIsEmailError(false);
    setIsPasswordError(false);
    setUsernameErrorMessage("");
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrorStateValues();

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
        setIsEmailError(true);
        setEmailErrorMessage(errorMapped.email);
      }

      if (errorMapped.password) {
        setIsPasswordError(true);
        setPasswordErrorMessage(errorMapped.password);
      }

      if (errorMapped.username) {
        setIsUsernameError(true);
        setUsernameErrorMessage(errorMapped.username);
      }
    } else if (response.data?.register.user) {
      console.log("Account Created");
      resetErrorStateValues();
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
                  error={isUsernameError}
                  helperText={usernameErrorMessage}
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
                  error={isEmailError}
                  helperText={emailErrorMessage}
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
                  helperText={passwordErrorMessage}
                  error={isPasswordError}
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
