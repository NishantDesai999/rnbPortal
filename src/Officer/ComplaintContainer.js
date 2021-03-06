import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SideFilter from "../Components/SideFilter";
import ComplaintTable from "./ComplaintTable";
import ComplaintReport from "./ComplaintReport";
import ComplaintMap from "./ComplaintMap";
import GeneralDialog from '../Components/GeneralDialog';
import { griev_type,status_type,getCookie, url } from '../constants';
// import Card from '@material-ui/core/Card';
import Empty from '../res/empty.svg';

const styles = theme => ({
    progressWrapper: {
        width: '100%',
        display: 'flex'
    },
    progress: {
        margin: 'auto',
        marginTop : '50px',
        textAlign: 'center',
       
    },
    wrapper: {
      //  paddingTop: '60px',
        display: 'block',
        // minHeight: '90vh',
        background: 'white'
    },
    filterBtn: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    SideFilter: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    padding10: {
        padding: '10px'
    }
})

class ComplaintContainer extends Component {

    state = {
        StartingDate: new Date(new Date().setMonth(new Date().getMonth()-6)).setHours(0,0,0,0),
        EndingDate: new Date().setHours(0,0,0,0),
        griev_type_map: new Map(griev_type),
        status_type_map : new Map(status_type),
        emergency_state : true,
        startAnimation: false,
        lodding : true,
        SideFilter: true,
        emptyList: true,
        filteredComplaints: []
    }

    handleStartingDateChange = (date) => {
        
        this.setState( oldState  => {

            let newFilteredComplaints;
                
            if(date > this.state.StartingDate){

                if(oldState.filteredComplaints.length === 0){
                    newFilteredComplaints = this.allComplaints;
                }
                
                newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                    complaint['time'] && (complaint['time'] >= date)
                ));

                console.log('After Remove :',newFilteredComplaints);

            }else{

                newFilteredComplaints = this.allComplaints.filter(complaint => {
                                
                    return complaint.complaint_status
                        && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                        && complaint.grievType
                        && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                        && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                        && (complaint.time >= date && complaint.time <= oldState.EndingDate)
                });

                console.log('After all filter :',newFilteredComplaints);

            }

            return { 
                filteredComplaints : newFilteredComplaints,
                StartingDate: date 
            }
        });

    }

    handleEndingDateChange = (date) => {
        
        date = date.setHours(0,0,0,0);
        this.setState( oldState  => {

            let newFilteredComplaints;
            if(date < this.state.EndingDate){

                if(oldState.filteredComplaints.length === 0){
                    newFilteredComplaints = this.allComplaints;
                }
                
                newFilteredComplaints = oldState.filteredComplaints.filter(complaint => {
                    console.log(complaint['time'] && (complaint['time'] <= date),new Date(date),new Date(complaint['time']));
                    
                    return complaint['time'] && (complaint['time'] <= date)
                });

                console.log('After Remove :',newFilteredComplaints);
            }else{

                newFilteredComplaints = this.allComplaints.filter(complaint => {
                                
                    return complaint.complaint_status
                        && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                        && complaint.grievType
                        && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                        && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                        && (complaint.time >= oldState.StartingDate && complaint.time <= date)
                        
                });

                console.log('After all filter :',newFilteredComplaints);
            }

            return { 
                filteredComplaints : newFilteredComplaints,
                EndingDate: date 
            }
        });


    }

    handleChange = name => e  => {

        
        this.setState({
            lodding : true
        });

        const value = e.target.value;
        console.log('handleChange : ',value,name);
        this.setState( oldState  => {
            
            let checked,newMap;
            if(oldState[name] instanceof Map){
                newMap = new Map(oldState[name]);  
                checked = !newMap.get(value) 
                newMap.set(value,checked);
            }else{
                newMap = checked = !oldState[name];
                console.log("inside emergency if");
                
            }

            let newFilteredComplaints = [];

            
            if(checked){
                
                if(name === "status_type_map"){

                    console.log("here2",oldState.emergency_state,this.allComplaints[0].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[0].isEmergency));
                    console.log("here3",oldState.emergency_state,this.allComplaints[1].isEmergency,(oldState.emergency_state===true || oldState.emergency_state !== this.allComplaints[1].isEmergency));
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.griev_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.complaint_status
                                && complaint.complaint_status.toUpperCase() == value.toUpperCase() 
                                && complaint.grievType
                                && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                                && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                                && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
                        });
                    
                    newFilteredComplaints = newFilteredComplaints.concat(oldState.filteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "griev_type_map"){
                            
                    // console.log("adding status : " + value ) 
                    // console.log(this.allComplaints);
                    // console.log(oldState.status_type_map);
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                            
                            return complaint.grievType
                                && complaint.grievType.toUpperCase() == value.toUpperCase() 
                                && complaint.complaint_status
                                && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                                && (oldState.emergency_state===true || oldState.emergency_state !== complaint.isEmergency)
                                && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
                        });
                    
                    newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
                    //console.log(newFilteredComplaints);

                }else if(name === "emergency_state"){

                    console.log("here ",this.allComplaints,oldState)
                    
                    newFilteredComplaints = this.allComplaints.filter(complaint => {
                        
                        return complaint.grievType
                            && oldState.griev_type_map.get(complaint.grievType.toUpperCase())
                            && complaint.complaint_status
                            && oldState.status_type_map.get(complaint.complaint_status.toUpperCase())
                            && (complaint.time >= oldState.StartingDate && complaint.time <= oldState.EndingDate)
                    });
                
                    //newFilteredComplaints = oldState.filteredComplaints.concat(newFilteredComplaints)
              
                    
                }
                console.log("Added",newFilteredComplaints);

            }else{ //Checked Else
                console.log("removing",oldState.filteredComplaints);
                
                if(oldState.filteredComplaints == []){
                    oldState.filteredComplaints = this.allComplaints;
                }

                if(name === "emergency_state"){
                    
                    //console.log(oldState.filteredComplaints, oldState.filteredComplaints[0]['isEmergency']);
                    
                    newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                        complaint['isEmergency'] && (complaint['isEmergency'] == true)
                    ));
                        
                    console.log(newFilteredComplaints);
                    
                }else{

                    let jsonName = null;
                    if(name === "status_type_map"){
                        jsonName = "complaint_status";
                    }else if(name === "griev_type_map"){
                        jsonName = "grievType"
                    }

                    //console.log(value,oldState.filteredComplaints[0][jsonName] && (oldState.filteredComplaints[0][jsonName].toUpperCase()));

                    newFilteredComplaints = oldState.filteredComplaints.filter(complaint => (
                        complaint[jsonName] && (complaint[jsonName].toUpperCase() !== value.toUpperCase())
                    ));
                    console.log(newFilteredComplaints);
              }


            }


            return {
                [name] : newMap,
                lodding : false,
                filteredComplaints : newFilteredComplaints
            }
          });


    }


    allComplaints = []


    handleDialogOpen = (dialogMsg, dialogTitle) => {        
        this.setState({ 
            openDialog: true,
            dialogMsg: dialogMsg,
            dialogTitle: dialogTitle
        });
    };

    handleClose = () => {
        this.setState({ openDialog: false });
    };

    exportExcel(e){

        console.log(this.state.filteredComplaints);
        var Headers = Object.keys(this.state.filteredComplaints[0]);
        console.log(Headers);
        //     ["_id", "road_code", "name", "postedUsers","location","isEmergency","grievType",
        // "description","complaint_status","time","estimated_completion"];
            
          
        let mHeaders = ["longitude","latitude", "complaint_status", "isEmergency", "_id", "road_code", "name", "grievType", "description", "time", "estimated_completion"];
        var CsvString = "";

        mHeaders.forEach(function(ColItem, ColIndex) {
            CsvString += ColItem + ',';
        });
        CsvString += "\r\n";
        this.state.filteredComplaints.forEach(function(RowItem, RowIndex) {
            Headers.forEach(function(ColItem, ColIndex) {
                
                if(ColItem === 'time' || ColItem ==='estimated_completion'){

                    let mDate = new Date(RowItem[ColItem]);
                    RowItem[ColItem] = mDate.getDate() + "-" + mDate.getMonth() + "-" + mDate.getFullYear();

                    console.log(RowItem[ColItem]);
                }
            if(ColItem!=='comments' && ColItem!== 'postedUsers'){
                console.log(ColItem, "  ", RowItem[ColItem]);
                CsvString += RowItem[ColItem] + ',';
            }
          });
          CsvString += "\r\n";
          console.log("\n");
        });
        console.log(CsvString);
        
        let link = document.createElement('a');
        link.setAttribute('href','data:application/vnd.ms-excel;charset=utf-8,'+encodeURIComponent(CsvString));
        link.setAttribute('download','R&BPortal_Data.csv');
        link.click();

        //e.downlaod = "R&BPortal_Data.xls"
        //window.open("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," + encodeURIComponent(CsvString));
        console.log("Exprot excel ");
        //window.open('data:application/vnd.ms-excel,' + encodeURIComponent(CsvString));
        
    }

    componentDidMount() {
        this.setState({
            startAnimation: true,
        })

        let headers = new Headers();
        headers.append('origin', '*');
        headers.append('auth', 'token ' + getCookie("roadGPortalAuth"));

        let req = new Request(url  + "getComplaints?isPaginated=0", {
            method: "GET",
            headers: headers,
            mode: 'cors'
        });

        fetch(req)
            .then(res => res.json())
            .then(res => {
               
                if(res.success){
                    console.log("complaints ", res);
                    
                    
                    console.log(res.complaints);
                    
                    
                    res.complaints.map(complaint => {
                        complaint.time = new Date(complaint.time).setHours(0,0,0,0);
                    })
                    
                    res.complaints = res.complaints.filter(c =>  {
                            console.log(c.time, Number.isNaN(c.time));
                            return !Number.isNaN(c.time)
                    });

                    this.allComplaints = res.complaints;
                    
                    console.log(this.allComplaints);
                    
                    if(this.props.dashboardButton){
                        let value = this.props.dashboardButton;

                        if(value.toUpperCase() === 'EMERGENCY'){
                            
                            let newFilteredComplaints = this.allComplaints.filter(complaint => {
                                return complaint['isEmergency'] && (complaint['isEmergency'] == true)
                            });
                            
                            

                            this.setState({
                                emergency_state : false,
                                filteredComplaints : newFilteredComplaints,
                            })

                        }else{
                            
                            let newFilteredComplaints = res.complaints;
                            const newMap = new Map(this.state.status_type_map); 
                            for (var [key, value] of newMap) {
                                newMap.set(key,!value);
                            }

                            newFilteredComplaints = newFilteredComplaints.filter(complaint => (
                                complaint['complaint_status'] && (complaint['complaint_status'].toUpperCase() === this.props.dashboardButton.toUpperCase())
                            ));
                            
                            const checked = !newMap.get(this.props.dashboardButton)
                            newMap.set(this.props.dashboardButton.toUpperCase(),checked);
                            console.log(newMap,this.props.dashboardButton);
                            
                            
                            this.setState({
                                
                                status_type_map : newMap,
                                filteredComplaints : newFilteredComplaints,
                            })
                        }
                    
                        

                        
                    }else{
                        
                        this.setState({
                            filteredComplaints : this.allComplaints
                        })
                    }

                    this.setState({
                        lodding : false
                    });

                    
                }else{
                    this.handleDialogOpen(res.data, "Error");
                }

            })
            .catch(err => {
                console.log(err);      
                this.setState({
                    lodding : false
                });          
                this.handleDialogOpen(err.message, "Error")
            });
    }

    handleFilterBar = () => {
        this.setState({
            filterDialogState: true
        })
    }

    handleFilterClose = () => {
        this.setState({
            filterDialogState: false
        })
    }

    render() {
        let { classes } = this.props;
        console.log(this.props);
        
        return (    
          <div className={classes.wrapper}>
            <GeneralDialog 
                openDialogState = {this.state.openDialog}
                dialogTitle = {this.state.dialogTitle}
                dialogMsg = {this.state.dialogMsg}  
                handleClose={this.handleClose}
                handleDialogOpen={this.handleDialogOpen}
            >
                {/* <Button>Hello</Button> */}
            </GeneralDialog>
            

                {this.state.lodding &&  <LinearProgress  className={classes.progress} />}    
                
                {!this.state.lodding && this.allComplaints && this.allComplaints.length !== 0 &&
                <Grid container spacing={0} style={{margin:'auto'}}>
                    <Grid item md={3} xs={12} style={{height: '97vh', paddingTop: '56px', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <SideFilter 
                            status_type_map={this.state.status_type_map} 
                            griev_type_map={this.state.griev_type_map} 
                            StartingDate={this.state.StartingDate}
                            EndingDate={this.state.EndingDate}
                            exportExcel = {this.exportExcel.bind(this)}
                            emergency_state={this.state.emergency_state}
                            handleChange={this.handleChange}
                            handleEndingDateChange = {this.handleEndingDateChange}
                            handleStartingDateChange ={this.handleStartingDateChange}
                        />
                    </Grid>
                    <Grid item md={9} xs={12} >
                        {   

                            (this.state.filteredComplaints && this.state.filteredComplaints.length != 0) ?
                            (<div style={{paddingTop: '50px'}}>
                                <Switch >
                                    <Route exact path="/Dashboard/Complaints/Table" render={() => (<ComplaintTable complaintsData={this.state.filteredComplaints} />)} />
                                    <Route exact path="/Dashboard/Complaints/Reports" render={() => (<ComplaintReport complaintsData={this.state.filteredComplaints} />)} />
                                    <Route exact path="/Dashboard/Complaints/Maps" render={() => (<ComplaintMap complaintsData={this.state.filteredComplaints} />)} />
                                    <Route path="/Dashboard/Complaints/*">
                                        <Redirect to="/Dashboard/" />
                                    </Route>
                                </Switch>
                            </div>)

                            : (
                                <div className={classes.progressWrapper} style={{height: '100vh'}}>
                                    <div style={{margin: 'auto', textAlign: 'center'}}>
                                        <img src={Empty} style={{width: '100px'}} />
                                        <br />
                                        <br />
                                        <Typography variant="display2" style={{color: 'black'}}>No such Complaints</Typography>
                                        <br />
                                        <Typography variant="headline" style={{color: 'rgba(0,0,0,0.5)'}}>Try some diffrent combinations</Typography>
                                    </div>
                                </div>
                            )
                        } 
                    </Grid>
                </Grid>
                }
                
                {!this.state.lodding && this.allComplaints && this.allComplaints.length === 0 &&
                <div className={classes.progressWrapper} style={{height: '100vh'}}>
                    <div style={{margin: 'auto', textAlign: 'center'}}>
                        <img src={Empty} style={{width: '100px'}} />
                        <br />
                        <br />
                        <Typography variant="display2" style={{color: 'black'}}>No Complaints...Yet!</Typography>
                        <br />
                        <Typography variant="headline" style={{color: 'rgba(0,0,0,0.5)'}}>Complaints posted by citizen will be shown here</Typography>
                    </div>
                </div>
                }
          </div>  
        );
    }
}

ComplaintContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintContainer);