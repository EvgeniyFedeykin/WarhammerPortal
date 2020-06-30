import React, {Component} from "react";
import { connect } from 'react-redux';

import * as utils from "../../Scripts/CommonFunctions.js";
import RosterMenu from "./RosterMenu/RosterMenu.js";
import DetachmentEditing from "./DetachmentEditing/DetachmentEditing.js";
import UnitSelection from "./UnitSelection/UnitSelection.js";
import UnitEditing from "./UnitEditing/UnitEditing.js";
import {RosterDetachment} from "../../Classes/CommonClasses.js";
import {RosterUnit} from "../../Classes/CommonClasses.js";
import {Roster} from "../../Classes/CommonClasses.js";
import "./NewRosterCreation.css";
import RosterEditing from "./RosterEditing/RosterEditing.js";
import {TransitionGroup} from 'react-transition-group';
import { CSSTransitionGroup } from 'react-transition-group';
import * as ActionCreators from "../../Store/ActionsCreators.js";

const _ = require('lodash');

//Main element with functionality in application

class RosterCreation extends Component{
    constructor(props) {
        super(props)
        this.ActiveDetachment = null;
        this.ActiveUnit = null;
        this.AddNewDetachment = this.AddNewDetachment.bind(this);
        this.EditDetachment = this.EditDetachment.bind(this);
        this.CopyDetachment = this.CopyDetachment.bind(this);
        this.DeleteDetachment = this.DeleteDetachment.bind(this);
        this.EditUnit = this.EditUnit.bind(this);
        this.CopyUnit = this.CopyUnit.bind(this);
        this.DeleteUnit = this.DeleteUnit.bind(this);
        this.EditRoster = this.EditRoster.bind(this);
        this.showUnitSelectionList = this.showUnitSelectionList.bind(this);
    }

    AddNewDetachment = () => {
        let NewId = utils.calculateNewId(this.props.Roster.RosterDetachments);
        let Detachments = this.props.Roster.RosterDetachments.slice();
        let NewDetachment = new RosterDetachment(NewId,[],null,null,null,this.props.Roster.id,null,null);
        Detachments.push(NewDetachment);
        const NewRoster = Object.assign({}, this.props.Roster, {RosterDetachments: Detachments});
        this.props.ASYNC_RetrieveFactions();
        this.props.ASYNC_RetrieveDetachments();
        this.props.ASYNC_RetrieveChapterTactics(null);
        this.props.NewDetachment(NewRoster,NewDetachment);
    }

    EditDetachment = (Detachment) => {
        this.props.SetActiveDetachment(Detachment);
        this.props.SetActiveUnit(null);
        this.props.ASYNC_RetrieveFactions();
        this.props.ASYNC_RetrieveDetachments();
        this.props.ASYNC_RetrieveChapterTactics(!!Detachment.Faction ? Detachment.Faction.id : null);
        this.props.RosterAction("Detachment Editing");
    }

    CopyDetachment = (Detachment) => {
       let NewId = utils.calculateNewId(this.props.Roster.RosterDetachments);
       this.props.CopyDetachment(Detachment.id, NewId);
    }

    DeleteDetachment = (Detachment) => {
        this.props.DeleteDetachment(Detachment.id);
    }
    
    EditUnit = (Unit) => {
       const Detach = this.props.Roster.RosterDetachments.find((detach) => detach.id == Unit.RosterDetachmentId);
       this.props.SetActiveUnit(Unit);
       (Detach.id != this.props.ActiveDetachment.id) && this.props.SetActiveDetachment(Detach);
       this.props.RosterAction("Unit Editing");
    }

    CopyUnit = (Detachment, Unit) => {
       let NewId = utils.calculateNewId(Detachment.RosterUnits);
       this.props.CopyUnit(Detachment.id, Unit.id, NewId);
    }

    DeleteUnit = (Detachment, Unit) => {
       this.props.DeleteUnit(Detachment.id, Unit.id);
    }

    EditRoster = () => {
       
       this.props.RosterAction("Roster Editing");
    }

    showUnitSelectionList = (Detachment) => {
        //this.props.SetLoading(true);
        if(_.isEmpty(this.props.RetrievedUnits) || this.props.RetrievedUnits[0].Faction.id != Detachment.Faction.id) { 
            this.props.ASYNC_RetrieveUnits(Detachment.Faction.id);
        }
        this.props.SetActiveDetachment(Detachment);
        this.props.RosterAction("Unit Selection");
    }

    render = () => {
        let WorkingArea = "";
        switch(this.props.Action) {
            case "Roster Editing": 
                WorkingArea = <div key = {1} className = "RosterEditing_WorkingArea"><RosterEditing/></div>;
            break;

            case "Detachment Editing": 
                WorkingArea = <div key = {2} className = "RosterEditing_WorkingArea"><DetachmentEditing/></div>;
            break;

            case "Unit Selection": 
                WorkingArea = <div key = {3} className = "RosterEditing_WorkingArea"><UnitSelection/></div>;
            break;

            case "Unit Editing": 
                WorkingArea = <div key = {4} className = "RosterEditing_WorkingArea"><UnitEditing/></div>;
            break;
        }
        return(
            <div className = "RosterEditing">
                <CSSTransitionGroup 
                    transitionName="RosterEditing_WorkingArea_Content" 
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={false}
                    transitionLeave={false}
                >
                    <RosterMenu 
                        Roster = {this.props.Roster}
                        ActiveDetachmentId = {(this.props.ActiveDetachment) ? this.props.ActiveDetachment.id : null}
                        ActiveUnitId = {(this.props.ActiveUnit) ? this.props.ActiveUnit.id : null}
                        NewDetachmentClick = {this.AddNewDetachment}
                        EditDetachmentClick = {this.EditDetachment}
                        CopyDetachmentClick = {this.CopyDetachment}
                        DeleteDetachmentClick  = {this.DeleteDetachment}
                        EditClick = {this.EditUnit} 
                        CopyClick = {this.CopyUnit} 
                        DeleteClick = {this.DeleteUnit} 
                        NewUnitClick = {this.showUnitSelectionList}
                        EditRosterClick = {this.EditRoster}
                    />
                </CSSTransitionGroup>
                <CSSTransitionGroup 
                    transitionName="RosterEditing_WorkingArea_Content" 
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnter={true} 
                    transitionEnterTimeout={500}
                    transitionLeave={false} 
                    transitionLeaveTimeout = {500}
                >
                   {WorkingArea}
                </CSSTransitionGroup>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        Action: state.RosterEditing.Action,
        Roster: state.RosterEditing.Roster,
        ActiveDetachment: state.RosterEditing.ActiveDetachment,
        ActiveUnit: state.RosterEditing.ActiveUnit,
        RetrievedUnits: state.retrievedUnits.Units
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        //DetachmentFaction: (DetachmentId, Faction) => dispatch(ActionCreators.DetachmentFaction(DetachmentId, Faction)),
        //DetachmentType: (DetachmentId, DetachmentType) => dispatch(ActionCreators.DetachmentType(DetachmentId, DetachmentType)),
        //ChapterTactic: (DetachmentId, ChapterTactic) => dispatch(ActionCreators.ChapterTactic(DetachmentId, ChapterTactic)),
        NewDetachment: (Roster, ActiveDetachment) => dispatch(ActionCreators.NewDetachment(Roster, ActiveDetachment)),
        SetActiveDetachment: (ActiveDetachment) => dispatch(ActionCreators.ActiveDetachment(ActiveDetachment)),
        CopyDetachment: (DetachmentId, NewId) => dispatch(ActionCreators.CopyDetachment(DetachmentId, NewId)),
        DeleteDetachment: (DetachmentId) => dispatch(ActionCreators.DeleteDetachment(DetachmentId)),
        AddNewUnit: (DetachmentId, NewId, BaseUnit) => dispatch(ActionCreators.AddNewUnit(DetachmentId, NewId, BaseUnit)),
        SetActiveUnit: (ActiveUnit) => dispatch(ActionCreators.ActiveUnit(ActiveUnit)),
        CopyUnit: (DetachmentId, UnitId, NewId) => dispatch(ActionCreators.CopyUnit(DetachmentId, UnitId, NewId)),
        DeleteUnit: (DetachmentId, UnitId) => dispatch(ActionCreators.DeleteUnit(DetachmentId, UnitId)),
        RosterAction: (ActionNAme) => dispatch(ActionCreators.RosterAction(ActionNAme)),
        SetLoading: (isLoading) => dispatch(ActionCreators.SetLoading(isLoading)),
        ASYNC_RetrieveUnits: (FactionId) => dispatch(ActionCreators.ASYNC_RetrieveUnits(FactionId)),
        ASYNC_RetrieveFactions: () => dispatch(ActionCreators.ASYNC_RetrieveFactions()),
        ASYNC_RetrieveDetachments: () => dispatch(ActionCreators.ASYNC_RetrieveDetachments()),
        ASYNC_RetrieveChapterTactics: (FactionId) => dispatch(ActionCreators.ASYNC_RetrieveChapterTactics(FactionId)),
        //RosterName: (RosterName) => dispatch(ActionCreators.RosterName(RosterName)),
        //RosterMaxPL: (RosterMaxPL) => dispatch(ActionCreators.RosterMaxPL(RosterMaxPL)),
        //RosterMaxPTS: (RosterMaxPTS) => dispatch(ActionCreators.RosterMaxPTS(RosterMaxPTS)),
        
    }
}

const containerRosterCreation = connect(
    mapStateToProps,
    mapDispatchToProps
  )(RosterCreation);


export default containerRosterCreation;