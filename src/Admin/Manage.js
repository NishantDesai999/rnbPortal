import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabbed from '@material-ui/core/Tabs';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
// import Toolbar from '@material-ui/core/Toolbar';
// import LinearProgress from '@material-ui/core/LinearProgress';

import Grievances from "../Components/grivancesTable";
import RejectionReasons from "../Components/rejectionReasons";

// import Card from '@material-ui/core/Card';

const styles = theme => ({
    wrapper: {
        // marginTop: '-56px',
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
    },
    ManageWrapper: {
        margin:'100px auto auto auto',
        textAlign: 'center',
        // padding: '20px',
        // borderRadius: '2px',
        [theme.breakpoints.up('sm')]: {
            width: "70%"
        },
    }
})

class Manage extends Component {

    state = {
        value: 0,
      };
    
    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        let { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.wrapper}>
                <Paper className={classes.ManageWrapper}>
                    <AppBar position="static"  textColor="primary" style={{ background: "white", color: 'black', }}>
                        <Tabbed value={value} onChange={this.handleChange} centered>
                            <Tab label="Manage Grievances" />
                            <Tab label="Manage Rejection Reasons" />
                        </Tabbed>
                    </AppBar>
                    {value === 0 && <Grievances />}
                    {value === 1 && <RejectionReasons />}
                </Paper>
            </div>  
        );
    }
}

Manage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Manage);