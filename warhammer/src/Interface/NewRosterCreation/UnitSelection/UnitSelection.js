import React, {Component} from "react";
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import * as ActionCreators from "../../../Store/ActionsCreators.js";
import "./UnitSelection.css";
import UnitsList from "../UnitsList/UnitsList.js";
import UnitRolesList from "../UnitRolesList/UnitRolesList.js";
import {RosterUnit} from "../../../Classes/CommonClasses.js";
import {Unit} from "../../../Classes/CommonClasses.js";
import * as utils from "../../../Scripts/CommonFunctions.js";
import ToTopButton from "../../../Data/UnitSelection/ToTopIcon.png";
import LoadingCircle from "../../LoadingCircle/LoadingCircle.js";

class UnitSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TopButtonVisible: false
        }
        this.ScrollToUnitsByRole = this.ScrollToUnitsByRole.bind(this);
        this.handleUnitSelection = this.handleUnitSelection.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    ScrollToUnitsByRole = (name) => {
        var theElement = document.getElementById("UnitListByRole"+name);
        theElement.scrollIntoView({behavior: "smooth"});
    }

    handleUnitSelection = (BaseUnit) => {
       let NewId = utils.calculateNewId(this.props.Detachment.RosterUnits);
       this.props.AddNewUnit(this.props.Detachment.id, NewId, BaseUnit);
       //this.props.RosterAction("Unit Editing");
    }

    scrollToTop = () => {
        const UnitsSelectionHeader = document.getElementById("UnitsSelectionHeader");
        UnitsSelectionHeader.scrollIntoView({behavior: "smooth"});
    }

    handleScroll = (e) => {
        const ScrollCount = e.target.scrollTop;
        this.props.CurrentScrollCount(ScrollCount);
    }

    componentDidMount = () => {
        const WorkingArea = document.getElementById("WorkingArea");
        WorkingArea.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount = () => {
        const WorkingArea = document.getElementById("WorkingArea");
        WorkingArea.removeEventListener("scroll", this.handleScroll);
    }

    render() {
        let FilteredRoles = utils.GetAvailableRoles(this.props.RetrievedUnits);
        let HideButtonClass = (parseInt(this.props.CurrentScroll) < parseInt(100)) ? " UnitSelection__HideButton" : "";
        let UnitSelectionComponent;
        if (!this.props.isLoading) {
            UnitSelectionComponent = 
                <div key= {1} id = "UnitsSelectionHeader" className = "UnitSelection__SelectionArea">
                    <div className = "UnitSelection__UnitList">
                        <h1 className = "UnitSelection__Header">Select a unit</h1>
                        <UnitsList 
                            Faction = {this.props.Faction} 
                            handleUnitSelection = {this.handleUnitSelection} 
                            Detachment = {this.props.Detachment}
                            handleScroll = {this.handleScroll}
                            Roles = {FilteredRoles}
                        />
                    </div>
                    <div className = "UnitSelection__RolesList">
                        <UnitRolesList 
                            FactionId = {this.props.Faction.id} 
                            ScrollToUnitsByRole = {this.ScrollToUnitsByRole}
                            Roles = {FilteredRoles}
                        />
                        <div className = {"UnitSelection__ToTopButton"+HideButtonClass} onClick = {this.scrollToTop}>
                            <img className = "UnitSelection__ToTop" src = {ToTopButton}/>
                        </div>
                    </div>
                </div>
        } else {
            UnitSelectionComponent = 
                 <div key= {2} className = "UnitSelection__UnitList" style = {{height:"300px"}}>
                    <h1 className = "UnitSelection__Header">Select a unit</h1>
                    <LoadingCircle />
                </div>
        }
        return (
            <div id = "UnitsSelection">
                <CSSTransitionGroup 
                    transitionName="UnitSelection__Component" 
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={true} 
                    transitionEnterTimeout={500}
                    transitionLeave={false} 
                    transitionLeaveTimeout = {500}
                >
                    {UnitSelectionComponent}
                </CSSTransitionGroup>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        Detachment: state.RosterEditing.ActiveDetachment,
        Faction: _.isEmpty(state.RosterEditing.ActiveDetachment) ? null : state.RosterEditing.ActiveDetachment.Faction,
        RetrievedUnits: state.retrievedUnits.Units,
        isLoading: state.retrievedUnits.isLoading, 
        Roster: state.RosterEditing.Roster,
        CurrentScroll: state.CurrentScrollCount
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        AddNewUnit: (DetachmentId, NewId, BaseUnit) => dispatch(ActionCreators.AddNewUnit(DetachmentId, NewId, BaseUnit)),
        RosterAction: (ActionNAme) => dispatch(ActionCreators.RosterAction(ActionNAme)),
        CurrentScrollCount: (CurrentScrollCount) => dispatch(ActionCreators.CurrentScrollCount(CurrentScrollCount))
    }
}

const containerUnitSelection = connect(
    mapStateToProps,
    mapDispatchToProps
)(UnitSelection);

export default containerUnitSelection;
