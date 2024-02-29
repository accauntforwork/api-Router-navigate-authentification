import  React,{ useRef, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Link, useNavigate } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function Login() {

  const [isLoading,setIsloading] = useState(false)

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setErrorback('');
  };

  const username = useRef();
  const password = useRef();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [errorback,setErrorback] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  function validateForm() {
    if (!username.current.value || !password.current.value) {
      setError("All fields are required");
      return false;
    }

    if (password.current.value.length <=5) {
      setError("Password must be at least 5 characters long");
      return false;
    }
    return true;
  }

  function handleClick(e) {
    setError("")
    e.preventDefault();

    if (validateForm()) {
    setIsloading(true)
      const user = {
        username:username.current.value,
        password:password.current.value
      }

      fetch("https:auth-rg69.onrender.com/api/auth/signin",{
        method:"POST",
        headers:{
          'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
      })
      .then(res=>res.json())
      .then(data=> {
        setIsloading(false)
        if (data.message == "Invalid Password!") {
          handleClickOpen();
          setErrorback(data.message)
        }
        if (data.message == "User Not found.") {
          handleClickOpen();
          setErrorback(data.message)
        }
        if (data.id){
          localStorage.setItem('token',data.accessToken)
          navigate('/')
        }
      })
      .catch(
        err => {
          console.log(err);
          setIsloading(false)
      })

      

    }
  }

  return (
    <Container>
      <Box>
        <Typography variant="h3" textAlign={"center"} gutterBottom>
          Login Page
        </Typography>

        <Box sx={{ mx: "auto", width: 600 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            inputRef={username}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            inputRef={password}
          />

          {error && (
            <Typography color="error" variant="body2" gutterBottom>
              {error}
            </Typography>
          )}

          <Button
            disabled = {isLoading?true:false}
            onClick={handleClick}
            variant="contained"
            fullWidth
            margin="normal"
            sx={{ mt: "2rem" }}
          >
            {isLoading?"Loading...":"Login"}
          </Button>
          <Button fullWidth
            margin="normal"
            sx={{ mt: "2rem" }}>
          <Link to={'/register'}> Back to Register page</Link>
          </Button>
          
        </Box>
      </Box>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Error
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {errorback}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </Container>
  );
}

export default Login;
