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
import LOGIN from "../graphql/mutations/login";
import { toErrorMap } from "../utils/toErrorMap";

const theme = createTheme();

const Login = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN);

  const [isUsernameOrEmailError, setIsUsernameOrEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [usernameOrEmailErrorMessage, setUsernameOrEmailErrorMessage] =
    useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const router = useRouter();

  const resetErrorStateValues = () => {
    setIsUsernameOrEmailError(false);
    setIsPasswordError(false);
    setUsernameOrEmailErrorMessage("");
    setPasswordErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrorStateValues();
    const data = new FormData(event.currentTarget);

    const usernameOrEmail = data.get("email");
    const password = data.get("password");

    const response = await login({
      variables: {
        userInfo: { usernameOrEmail, password },
      },
    });

    if (response.data?.login.errors) {
      const errorMapped = toErrorMap(response.data.login.errors);
      console.log(toErrorMap(response.data.login.errors));
      if (errorMapped.usernameOrEmail) {
        setUsernameOrEmailErrorMessage(errorMapped.usernameOrEmail);
        setIsUsernameOrEmailError(true);
      }

      if (errorMapped.password) {
        setPasswordErrorMessage(errorMapped.password);
        setIsPasswordError(true);
      }
    } else if (response.data?.login.user) {
      if (typeof router.query.next === "string") {
        router.push(router.query.next);
      } else {
        console.log("Login Successful");
        resetErrorStateValues();
        router.push("/");
      }
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
            Login
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
              error={isUsernameOrEmailError}
              helperText={usernameOrEmailErrorMessage}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={isPasswordError}
              helperText={passwordErrorMessage}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>

              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
