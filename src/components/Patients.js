import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  AppBar,
  Toolbar,
  IconButton,
  Card,
  Button,
  Input,
  Autocomplete,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import db from "../config";
import { address } from "./AddressList";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Patients() {
  const [patientArr, setPatientArr] = useState([
    {
      firstName: null,
      lastName: null,
      dob: null,
      contactLanguage: null,
      phone: null,
      email: null,
      address1: null,
      notes: null,
    },
  ]);
  const [alert, setAlert] = useState("");
  const [alertError, setAlertError] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  const handleChange = async (e, index) => {
    let patientArrayCopy = [...patientArr];
    patientArrayCopy[index][e.target.name] = e.target.value;
    setPatientArr(patientArrayCopy);
    if (alert !== "") {
      setAlert("");
    }
  };
  const handleChangeAddress = async (e, value, index) => {
    let patientArrayCopy = [...patientArr];
    patientArrayCopy[index]["address1"] = value;
    setPatientArr(patientArrayCopy);
  };

  const addPatientData = () => {
    if (
      patientArr[patientArr.length - 1].firstName === null ||
      patientArr[patientArr.length - 1].lastName === null ||
      patientArr[patientArr.length - 1].dob === null ||
      patientArr[patientArr.length - 1].contactLanguage === null ||
      patientArr[patientArr.length - 1].phone === null ||
      patientArr[patientArr.length - 1].email === null ||
      patientArr[patientArr.length - 1].address1 === null
    ) {
      setAlert("Fields cannot be empty !!");
      setAlertError(true);
      return;
    }
    let obj = {
      firstName: null,
      lastName: null,
      dob: null,
      contactLanguage: null,
      phone: null,
      email: null,
      address1: null,
      notes: null,
    };
    let arr = [...patientArr];

    arr.push(obj);
    setPatientArr(arr);
  };

  const removeDetails = (index) => {
    const patientsData = [...patientArr];
    patientsData.splice(index, 1);
    setPatientArr(patientsData);
  };
  const initializeData = async () => {
    setisLoading(true);
    const patientData = db.collection("patientData");
    const snapshot = await patientData.get();
    const patientArrData = snapshot.docs.map((doc) => {
      // console.log(doc.data().firstName,"hhhhhhhhhhhhh")
      return {
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        dob: doc.data().dob,
        contactLanguage: doc.data().contactLanguage,
        phone: doc.data().phone,
        email: doc.data().email,
        address1: doc.data().address1,
        notes: doc.data().notes,
      };
    });

    patientArrData.push({
      firstName: null,
      lastName: null,
      dob: null,
      contactLanguage: null,
      phone: null,
      email: null,
      address1: null,
      notes: null,
    });
    setPatientArr(patientArrData);
    setisLoading(false);
  };

  const submitData = async () => {
    if (
      patientArr[patientArr.length - 1].firstName === null ||
      patientArr[patientArr.length - 1].lastName === null ||
      patientArr[patientArr.length - 1].dob === null ||
      patientArr[patientArr.length - 1].contactLanguage === null ||
      patientArr[patientArr.length - 1].phone === null ||
      patientArr[patientArr.length - 1].email === null ||
      patientArr[patientArr.length - 1].address1 === null
    ) {
      setAlert("Fields cannot be empty !!");
      setAlertError(true);
      return;
    }
    setisLoading(true);
    const patientData = db.collection("patientData");
    const snapshot = await patientData.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    for (let i = 0; i < patientArr.length; i++) {
      await patientData.doc(i.toString()).set(patientArr[i]);
    }
    setAlert("Data sent successfully !");
    setAlertError(false);
    setisLoading(false);
  };

  const setLoader = () => {
    return <></>;
  };
  useEffect(() => {
    console.log("ivde veendum call ayi");
    initializeData();
  }, []);

  return (
    <>
      <Container xs={12} md={12} sx={{ bgcolor: "#E5E5E5" }}>
        <AppBar position="static" sx={{ mt: 3, bgcolor: "black" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Patients Referrel Form
            </Typography>
          </Toolbar>
        </AppBar>

        <Box xs={12} md={12} lg={12} sx={{ bgcolor: "#c1e3dd" }}>
          <Box sx={{ bgcolor: "white" }}>
            <Typography
              color="#0B2B5B"
              gutterBottom
              sx={{
                mt: 2,
                pt: 3,
                pb: 0,
                fontSize: 30,
                fontFamily: "Montserrat",
                fontWeight: 500,
              }}
            >
              Patients Referrel Form
            </Typography>
            <Typography
              variant="h6"
              color="#0B2B5B"
              gutterBottom
              sx={{ pb: 5, fontSize: 15 }}
            >
              Hayes Valley Health Scan Francisco
            </Typography>
            {alert !== "" && (
              <Alert
                variant="filled"
                severity={alertError ? "error" : "success"}
              >{alert}</Alert>
            )}
          </Box>
          <Typography
            variant="h6"
            color="#0B2B5B;"
            gutterBottom
            sx={{ mt: 5, pt: 3, pb: 0, fontSize: "24px", fontWeight: 500 }}
          >
            Referrel Patients
          </Typography>
          <Typography
            variant="h6"
            color="#0B2B5B;"
            sx={{ fontSize: "17px", mb: 5 }}
          >
            You can add upto five patients at a time
          </Typography>
          <Card
            xs={12}
            md={12}
            sx={{
              bgcolor: "white",
              mx: "auto",
              ml: 5,
              mr: 5,
              mt: 2,
              p: 3,
            }}
          >
            {patientArr.map((data, index) => {
              const fullName = data.firstName
                ? data.firstName + " " + (data.lastName ?? "")
                : "New Referral";
              //console.log(length,"my length")
              return (
                <>
                  <Container
                    xs={12}
                    md={12}
                    lg={12}
                    sx={{ position: "static" }}
                  >
                    <Accordion
                      xs={12}
                      md={8}
                      sx={{ mt: 1, borderRadius: 1 }}
                      defaultExpanded={false}
                    >
                      <AccordionSummary
                        xs={12}
                        md={8}
                        expandIcon={
                          <>
                            <ExpandMoreIcon
                              sx={{ position: "relative", right: "0px" }}
                            />
                          </>
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography
                          fullWidth
                          sx={{
                            float: "left",
                            backgroundColor: "#25A575;",
                            p: 1,

                            color: "white",
                            mr: 3,
                          }}
                        >
                          {index + 1}
                        </Typography>
                        <Typography
                          sx={{
                            textAlign: "left",
                            fontWeight: 800,
                            fontSize: "20px",
                            marginRight: "20px",
                          }}
                        >
                          {fullName}
                        </Typography>

                        <DeleteIcon
                          onClick={() => removeDetails(index)}
                          sx={{
                            position: "absolute",
                            right: "40px",
                            top: "20px",
                            bottom: "20px",
                          }}
                        />
                      </AccordionSummary>

                      <AccordionDetails>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              id="firstName"
                              sx={{ color: "gray" }}
                              name="firstName"
                              value={data.firstName ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="First name"
                              fullWidth
                              autoComplete="given-name"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              id="lastName"
                              sx={{ color: "gray" }}
                              name="lastName"
                              value={data.lastName ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="Last name"
                              fullWidth
                              autoComplete="family-name"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Input
                              type="Date"
                              sx={{ mt: 2, color: "gray" }}
                              required
                              id="dob"
                              name="dob"
                              value={data.dob ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="Date Of Birth"
                              fullWidth
                              autoComplete="given-dob"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              id="contactLanguage"
                              sx={{ color: "gray" }}
                              name="contactLanguage"
                              value={data.contactLanguage ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="Contact Language"
                              fullWidth
                              autoComplete="contact-lang"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Input
                              type="Number"
                              required
                              id="phone"
                              sx={{ mt: 2, color: "black" }}
                              name="phone"
                              value={data.phone ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              placeholder="Phone Number"
                              label="Number"
                              fullWidth
                              autoComplete="given-phn"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              id="email"
                              sx={{ color: "gray" }}
                              name="email"
                              value={data.email ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="Email"
                              fullWidth
                              autoComplete="contact-email"
                              variant="standard"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            {/* <TextField
                          required
                          id="address1" sx={{color:"gray"}}
                          name="address1" value={data.address1??""}
                          onChange={(event) => handleChange(event, index)}
                          label="Address line 1"
                          fullWidth
                          autoComplete=""
                          variant="standard"
                         
                        /> */}
                            {/* <Autocomplete
                          id="free-solo-demo"  name="address1" value={data.address1??""}
                          // onChange={(event) => handleChange(event, index)}
                          address1
                          options={address.map((option) => option.streetAddress)}
                          renderInput={(params) => <TextField { ...params 
                        }  onChange={(event) => handleChange(event, index)} label="Address" />}/> */}
                            <Autocomplete
                              name="address1"
                              value={data.address1 ?? ""}
                              sx={{ borderTop: "none" }}
                              options={address.map(
                                (option) => option.streetAddress
                              )}
                              onChange={(event, value) =>
                                handleChangeAddress(event, value, index)
                              } // prints the selected value
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Address"
                                  variant="standard"
                                  fullWidth
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ mb: 2 }}>
                            <TextField
                              id="Notes"
                              sx={{ color: "gray" }}
                              name="notes"
                              value={data.notes ?? ""}
                              onChange={(event) => handleChange(event, index)}
                              label="Notes/Reasons"
                              fullWidth
                              autoComplete="notes-reasons"
                              variant="standard"
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Container>
                </>
              );
            })}
          </Card>
          <Grid item xs={12} sx={{ mt: 1, mb: 5 }}>
            <Button
              variant="text"
              onClick={addPatientData}
              sx={{ color: "#0B2B5B" }}
            >
              {console.log("render called")}
              <Icon>add_circle</Icon>Add New Patient
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ m: 8, ml: 5, mr: 5 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 25,
                mb: 10,
                color: "white",
                bgcolor: "#0B2B5B;",
              }}
              onClick={submitData}
              // onMouseLeave={Alert}
            >
              Send Referrels
            </Button>
          </Grid>
        </Box>
        <br />
      </Container>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
