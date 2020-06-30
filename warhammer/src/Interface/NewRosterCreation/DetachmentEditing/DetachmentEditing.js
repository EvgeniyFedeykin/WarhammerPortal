import React, {Component} from "react";
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

import "./DetachmentEditing.css";
import DetachmentParameterChoice from "./DetachmentParameterChoice.js";
import * as utils from "../../../Scripts/CommonFunctions.js";
import FactionGraphicList from "../../FactionGraphicList/FactionGraphicList.js";
import * as ActionCreators from "../../../Store/ActionsCreators.js";
import LoadingCircle from "../../LoadingCircle/LoadingCircle.js";

const _ = require('lodash');

class DetachmentEditing extends Component {
    constructor(props) {
        super(props);
        this.handleDetachmentNameChange = this.handleDetachmentNameChange.bind(this);
        this.handleDetachmentFactionChange = this.handleDetachmentFactionChange.bind(this);
        this.handleDetachmentChapterTacticChange = this.handleDetachmentChapterTacticChange.bind(this);
        this.showFactionSelectionWindow = this.showFactionSelectionWindow.bind(this);
        this.hideFactionSelectionWindow = this.hideFactionSelectionWindow.bind(this);
    }
   
    handleDetachmentNameChange(DetachmentId) {
        const DetachmentType = this.props.retrievedDetachments.find(detach => detach.id == DetachmentId);
        let Detachments = this.props.Roster.RosterDetachments.slice();
        let NeededDetachment = Detachments.find((detach) => detach.id == this.props.RosterDetachment.id);
        const DetachIndex = Detachments.indexOf(NeededDetachment);
        NeededDetachment = Object.assign({}, NeededDetachment);
        NeededDetachment.Detachment = DetachmentType;
        NeededDetachment.TotalDetachCP = NeededDetachment.Detachment.CommandBenefit;
        Detachments.splice(DetachIndex, 1, NeededDetachment);
        let NewRoster = Object.assign({}, this.props.Roster, {RosterDetachments: Detachments});
        NewRoster = utils.recalculateRosterCost(NewRoster);
       this.props.SetDetachmentParameters(NewRoster,NeededDetachment);
    }

    handleDetachmentFactionChange(FactionId) {
        let PreviousFactionId = null;
        if(!_.isEmpty(this.props.RosterDetachment) && !_.isEmpty(this.props.RosterDetachment.Faction)){
            PreviousFactionId = this.props.RosterDetachment.Faction.id;
        }
        const Faction = this.props.retrievedFactions.find(faction => faction.id == FactionId);
        let Detachments = this.props.Roster.RosterDetachments.slice();
        let NeededDetachment = Detachments.find((detach) => detach.id == this.props.RosterDetachment.id);
        const DetachIndex = Detachments.indexOf(NeededDetachment);
        NeededDetachment = Object.assign({}, NeededDetachment);
        NeededDetachment.Faction = Faction;
        Detachments.splice(DetachIndex, 1, NeededDetachment);
        const NewRoster = Object.assign({}, this.props.Roster, {RosterDetachments: Detachments});
        this.props.SetDetachmentParameters(NewRoster,NeededDetachment);
        this.props.FactionSelectionWindow(false);
        if(PreviousFactionId != FactionId) {
            this.props.ASYNC_RetrieveChapterTactics(FactionId);
        }
    }

    handleDetachmentChapterTacticChange(ChapterTacticId) {
        let ChapterTactic = this.props.retrievedChapterTactics.find(tactic => tactic.id == ChapterTacticId);
        let Detachments = this.props.Roster.RosterDetachments.slice();
        let NeededDetachment = Detachments.find((detach) => detach.id == this.props.RosterDetachment.id);
        const DetachIndex = Detachments.indexOf(NeededDetachment);
        NeededDetachment = Object.assign({}, NeededDetachment);
        NeededDetachment.ChapterTactic = ChapterTactic;
        Detachments.splice(DetachIndex, 1, NeededDetachment);
        const NewRoster = Object.assign({}, this.props.Roster, {RosterDetachments: Detachments});
        this.props.SetDetachmentParameters(NewRoster,NeededDetachment);
    }

    showFactionSelectionWindow() {
       this.props.FactionSelectionWindow(true);
    }

    hideFactionSelectionWindow() {
       this.props.FactionSelectionWindow(false);
    }

    render() {
        let FactionSelectionWindow = (
            this.props.FactionSelection ? (
                <div className = "DetachmentEditing__FactionSelectionWindow">
                    <h2 className = "DetachmentEditing__FactionSelectionWindow_Header">Choose the Roster's faction</h2>
                    <button onClick = {this.hideFactionSelectionWindow} className = "DetachmentEditing__FactionSelectionWindow_CloseButton">x</button>
                    <FactionGraphicList buttonClick = {this.handleDetachmentFactionChange}/>
                </div>
            ) : null
        );
        let LoadingCircleWindow = (
            this.props.isLoading ? <LoadingCircle /> : null
        );
        let FactionImage;
        if(this.props.RosterDetachment.Faction) {
            FactionImage = <img className = "DetachmentEditing__FactionImage" src = {this.props.RosterDetachment.Faction.CodexImage} alt = {this.props.RosterDetachment.Faction.Name}/>
        }
        let DetachmentImage;
        if(this.props.RosterDetachment.Detachment) {
            DetachmentImage = 
            <figure key = {this.props.RosterDetachment.Detachment.Name} className = "DetachmentEditing__DetachmentImageFigure">
                <img className = "DetachmentEditing__DetachmentImage" src = {this.props.RosterDetachment.Detachment.Image} alt = {this.props.RosterDetachment.Detachment.Name}/>
            </figure>
        }
        let DetachmentName = (this.props.RosterDetachment.Detachment) ? (this.props.RosterDetachment.Detachment.Name) : "New Detachment";
        return (
            <div className = "DetachmentEditing">
                <h1 className = "DetachmentEditing__Header">Edit {DetachmentName}</h1>
                <CSSTransitionGroup 
                    transitionName="DetachmentEditing__Transition" 
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                    transitionEnterTimeout={300} 
                    transitionLeaveTimeout = {300}
                >
                    {FactionSelectionWindow}
                </CSSTransitionGroup>
                <CSSTransitionGroup 
                    transitionName="DetachmentEditing__Transition" 
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                    transitionEnterTimeout={300} 
                    transitionLeaveTimeout = {300}
                >
                    {LoadingCircleWindow}
                </CSSTransitionGroup>
                <div className = "DetachmentEditing__FactionDiv">
                    <div className="DetachmentEditing__CurrentFaction">
                        <button className = "DetachmentEditing__Button" onClick = {this.showFactionSelectionWindow}>Faction's list</button>
                        <p>Current chosen Faction : </p>
                    </div>
                    <div className = "DetachmentEditing__ChosenFactionLabel"><figure className = "DetachmentEditing__ChosenFactionTitle">{FactionImage}<figcaption>{this.props.RosterDetachment.Faction ? this.props.RosterDetachment.Faction.Name : "--none--"}</figcaption></figure></div>
                </div>
                <div className = "DetachmentEditing__MiddleDiv">
                    <DetachmentParameterChoice ObjectsArray = {this.props.retrievedDetachments} ListTypeNumber = {1} ObjectId = {this.props.RosterDetachment.Detachment ? this.props.RosterDetachment.Detachment.id : ""} handleChange = {this.handleDetachmentNameChange} />
                    <DetachmentParameterChoice ObjectsArray = {this.props.retrievedChapterTactics} ListTypeNumber = {3} ObjectId = {this.props.RosterDetachment.ChapterTactic && this.props.RosterDetachment.ChapterTactic.id ? this.props.RosterDetachment.ChapterTactic.id : ""} handleChange = {this.handleDetachmentChapterTacticChange} />
                </div>
                <CSSTransitionGroup 
                    transitionName="DetachmentEditing__Transition" 
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                    transitionEnter = {true}
                    transitionEnterTimeout={300} 
                    transitionLeave = {false}
                    transitionLeaveTimeout = {300}
                >
                    {DetachmentImage}
                </CSSTransitionGroup>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        RosterDetachment: state.RosterEditing.ActiveDetachment,
        FactionSelection: state.FactionSelection,
        Roster: state.RosterEditing.Roster,
        retrievedFactions: state.retrievedFactions.Factions,
        retrievedDetachments: state.retrievedDetachments.Detachments,
        retrievedChapterTactics: state.retrievedChapterTactics.ChapterTactics,
        isLoading: state.retrievedFactions.isLoading || state.retrievedDetachments.isLoading || state.retrievedChapterTactics.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        FactionSelectionWindow: (FlagValue) => dispatch(ActionCreators.FactionSelectionWindow(FlagValue)),
        SetDetachmentParameters: (NewRoster,NeededDetachment) => dispatch(ActionCreators.SetDetachmentParameters(NewRoster,NeededDetachment)),
        ASYNC_RetrieveChapterTactics: (FactionId) => dispatch(ActionCreators.ASYNC_RetrieveChapterTactics(FactionId))
    }
}

const containerDetachmentEditing = connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetachmentEditing);

export default containerDetachmentEditing;