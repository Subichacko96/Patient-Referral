import React, { Component } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import db from "../config";
import { address } from "./AddressList";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from '@mui/material/Backdrop';

export default class Patients extends Component {
  constructor(props) {
    super();
    this.state = {
      patientsArr: [
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
      ],
      alert: false,
      isLoading: false,
    };
  }
  handleChange = async (e, index) => {
    // console.log(e,index,"ggggggg")
    let patientsArr = this.state.patientsArr;
    patientsArr[index][e.target.name] = e.target.value;
    await this.setState({ patientsArr: patientsArr, alert: false });
  };
  handleChangeAddress = async (e, value, index) => {
    console.log(e, index, value, "adress value here");
    let patientsArr = this.state.patientsArr;
    patientsArr[index]["address1"] = value;
    await this.setState({ patientsArr: patientsArr });
  };

  addPatientData = () => {
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
    let arr = this.state.patientsArr;

    arr.push(obj);
    this.setState({
      patientsArr: arr,
    });
    console.log(this.state.patientsArr, "👑👑");
  };
  Alert = () => {
    if (this.state.alert === true) {
      return (
        <>
          <Alert variant="filled" severity="success">
            Patient Referrals sent successfully!
          </Alert>
        </>
      );
    }
    return null;
  };
  removeDetails = (index) => {
    console.log(index, "🎯🎯🎯");
    const patientsData = this.state.patientsArr;
    // const key_index = this.state.eventArr[index];

    patientsData.splice(index, 1);

    this.setState({
      patientsArr: patientsData,
    });
    console.log(this.state.patientsArr);
  };
  initializeData = async () => {
    this.setState({isLoading:true})
    const patientData = db.collection("patientData");
    const snapshot = await patientData.get();
    const patientArr = snapshot.docs.map((doc) => {
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

    patientArr.push({
      firstName: null,
      lastName: null,
      dob: null,
      contactLanguage: null,
      phone: null,
      email: null,
      address1: null,
      notes: null,
    });
    this.setState({ patientsArr: patientArr,isLoading:false });
  };

  submitData = async () => {
    this.setState({ isLoading: true });
    const patientData = db.collection("patientData");
    const snapshot = await patientData.get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    for (let i = 0; i < this.state.patientsArr.length; i++) {
      await patientData.doc(i.toString()).set(this.state.patientsArr[i]);
    }
    this.setState({ alert: true, isLoading: false });
  };

  setLoader = () => {
    return (
      <>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.isLoading}
          
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    );
  };

  componentDidMount() {
    this.initializeData();
  }
  render() {
    return (<>
      <Container maxWidth="lg" sx={{ bgcolor: "#E5E5E5" }}>
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

        <Box sx={{ bgcolor: "#c1e3dd", m: 10 }}>
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
            <this.Alert />
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
            sx={{
              minWidth: 275,
              bgcolor: "white",
              mx: "auto",
              ml: 5,
              mr: 5,
              mt: 2,
              p: 3,
            }}
          >
            {this.state.patientsArr.map((data, index) => {
              const length = this.state.patientsArr.length;
              const fullName = data.firstName
                ? data.firstName + " " + (data.lastName ?? "")
                : "New Referral";
              //console.log(length,"my length")
              return (
                <>
                  <Accordion
                    sx={{ mt: 1, borderRadius: 1 }}
                    defaultExpanded={false}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography
                        fullWidth
                        sx={{
                          float: "left",
                          backgroundColor: "#25A575;",
                          p: 1,
                          width: 20,
                          color: "white",
                          mr: 3,
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ textAlign: "left", width: 700 }}
                      >
                        {fullName}
                      </Typography>
                      <Typography sx={{ position: "static" }}>
                        {" "}
                        <DeleteIcon
                          onClick={() => this.removeDetails(index)}
                          sx={{ float: "right" }}
                        />
                      </Typography>
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
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
                          onChange={(event) => this.handleChange(event, index)}
                          label="Address line 1"
                          fullWidth
                          autoComplete=""
                          variant="standard"
                         
                        /> */}
                          {/* <Autocomplete
                          id="free-solo-demo"  name="address1" value={data.address1??""}
                          // onChange={(event) => this.handleChange(event, index)}
                          address1
                          options={address.map((option) => option.streetAddress)}
                          renderInput={(params) => <TextField { ...params 
                        }  onChange={(event) => this.handleChange(event, index)} label="Address" />}/> */}
                          <Autocomplete
                            name="address1"
                            value={data.address1 ?? ""}
                            sx={{ borderTop: "none" }}
                            options={address.map(
                              (option) => option.streetAddress
                            )}
                            onChange={(event, value) =>
                              this.handleChangeAddress(event, value, index)
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
                            onChange={(event) =>
                              this.handleChange(event, index)
                            }
                            label="Notes/Reasons"
                            fullWidth
                            autoComplete="notes-reasons"
                            variant="standard"
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </>
              );
            })}
          </Card>
          <Grid item xs={12} sx={{ mt: 1, mb: 5 }}>
            <Button
              variant="text"
              onClick={this.addPatientData}
              sx={{ color: "#0B2B5B" }}
            >
              {" "}
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
              onClick={this.submitData}
              onMouseLeave={this.Alert}
            >
              Send Referrels
            </Button>
          </Grid>
        </Box>
        <br />
      </Container>
      <this.setLoader/>
      </>
    );
  }
}
