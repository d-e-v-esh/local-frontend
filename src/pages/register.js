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
import REGISTER from "../graphql/mutations/register";

const theme = createTheme();

const Register = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

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
    // const data = new FormData(event.currentTarget);
    const values = { username, email, password, fullName: "lkasslkas" };
    const response = await register({
      variables: { options: values },

      update: (cache, { data }) => {
        cache.writeQuery({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: data?.register.user,
          },
        });
      },
    });

    console.log({ response });

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

      // need to make these more distinct with username and email already taken messages

      if (errorMapped["username or email"]) {
        if (errorMapped["username or email"].includes("username")) {
          setUsernameErrorMessage(errorMapped["username or email"]);
          setIsUsernameError(true);
        }
        if (errorMapped["username or email"].includes("email")) {
          setEmailErrorMessage(errorMapped["username or email"]);
          setIsEmailError(true);
        }
      }

      console.log(errorMapped);
    } else if (response.data?.register.user) {
      // worked
      router.push("/");
    }
    // console.log({
    //   register: register,
    //   username: data.get("username"),
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });
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
                  onChange={(e) => setUsername(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
