import React, {Component} from "react";
import { connect } from 'react-redux';

import "./EditUnitPsychicPowers.css";
import ChoiceUnitPsychicPower from "./ChoiceUnitPsychicPower.js";
import * as ActionCreators from "../../../Store/ActionsCreators.js";
import * as utils from "../../../Scripts/CommonFunctions.js";
import {SetUnitPsychicPowers} from "../../../Scripts/BusinessLogicObjectCreators.js";


class EditUnitPsychicPowers extends Component {
    constructor(props) {
        super(props);
        this.ChosenAvailableSpells = [];
        this.ChosenSelectedSpells = [];
        this.ChooseAvailablePsychicPowers = this.ChooseAvailablePsychicPowers.bind(this);
        this.ChooseSelectedPsychicPowers = this.ChooseSelectedPsychicPowers.bind(this);
        this.AddPsychicPowers = this.AddPsychicPowers.bind(this);
        this.RemovePsychicPowers = this.RemovePsychicPowers.bind(this);
        this.initializeComponentState = this.initializeComponentState.bind(this);
    }

    initializeComponentState = () => {
        let AddButtonLocked;
        let RemoveButtonLocked;
        let AvailableSpells = this.props.Unit.BaseUnit.AvailableSpells.slice();
        let SelectedSpells = this.props.Unit.SpellsSelected.slice();
        if(!this.props.Unit.SpellsSelected || this.props.Unit.SpellsSelected.length == 0) {
            AddButtonLocked = false;
            RemoveButtonLocked = true;
            if(this.props.KnowsSmite) {
                const Spell = AvailableSpells.find((spell) => parseInt(spell.id) == parseInt(1));
                if(!!Spell) { 
                    SelectedSpells.push(Spell);
                    AvailableSpells.splice(AvailableSpells.indexOf(Spell), 1);
                }
            }
        } else  {
            SelectedSpells.forEach(function(spell) {
                AvailableSpells.splice(AvailableSpells.indexOf(AvailableSpells.find((CurrentSpell) => CurrentSpell.id == spell.id)), 1);
            });
            if(SelectedSpells.length < this.props.MaxSpells) {
                AddButtonLocked = false;
                RemoveButtonLocked = false;
            } else {
                AddButtonLocked = true;
                RemoveButtonLocked = false;
            }
        }
       this.props.SetPsychicPowerMenuButtons(AvailableSpells, SelectedSpells, RemoveButtonLocked, AddButtonLocked);
       this.props.UpdateActiveUnit(SetUnitPsychicPowers(SelectedSpells));
    }

    componentWillMount() {
        this.initializeComponentState();
    }

    componentDidUpdate(prevProps) {
        if((this.props.Unit.id != prevProps.Unit.id) || (this.props.Unit.RosterDetachmentId != prevProps.Unit.RosterDetachmentId)) {
            this.initializeComponentState();
        }
    }

    ChooseAvailablePsychicPowers(event) {
        let SelectedOptions = event.target.selectedOptions;
        let Spells = [];
        let AddButtonLocked;
        if(!_.isEmpty(SelectedOptions)) {

            
            for(let i=0;i<SelectedOptions.length;i++) {
                const Spell = this.props.AvailableSpells.find((spell) => spell.id == SelectedOptions.item(i).value);
                Spells.push(Spell);
            }
           
        }
        if(Spells.length + this.props.SelectedSpells.length > this.props.MaxSpells) {
            this.ChosenAvailableSpells = [];
            AddButtonLocked = true;
        } else {
            this.ChosenAvailableSpells = Spells;
            AddButtonLocked = false;
        }
       this.props.SetPsychicPowerMenuButtons(this.props.AvailableSpells, this.props.SelectedSpells, this.props.RemoveButtonLocked, AddButtonLocked);
      
    }

    ChooseSelectedPsychicPowers(event) {
        let SelectedOptions = event.target.selectedOptions;
        let Spells = [];
        let RemoveButtonLocked;
        if(!_.isEmpty(SelectedOptions)) {
            for(let i=0;i<SelectedOptions.length;i++) {
                const Spell = this.props.SelectedSpells.find((spell) => spell.id == SelectedOptions.item(i).value);
                Spells.push(Spell);
            }
        }
        if(Spells.length == 1 && Spells[0].id == 1) {
            this.ChosenSelectedSpells = [];
            RemoveButtonLocked = true;
        } else {
            this.ChosenSelectedSpells = Spells;
            RemoveButtonLocked = false;
        }
        this.props.SetPsychicPowerMenuButtons(this.props.AvailableSpells, this.props.SelectedSpells, RemoveButtonLocked, this.props.AddButtonLocked);
    }

    AddPsychicPowers() {
        let AddButtonLocked;
        let RemoveButtonLocked;
        let AvailableSpells = this.props.AvailableSpells.slice();
        let SelectedSpells = this.props.SelectedSpells.slice();
        if(!_.isEmpty(this.ChosenAvailableSpells)) {
            this.ChosenAvailableSpells.forEach((element) => {
                AvailableSpells.splice(AvailableSpells.indexOf(element), 1);
                SelectedSpells.push(element);
            });
            AddButtonLocked = (SelectedSpells.length >= this.props.MaxSpells);
            RemoveButtonLocked = false;
            this.ChosenAvailableSpells = [];
            this.ChosenSelectedSpells = [];
            this.props.SetPsychicPowerMenuButtons(AvailableSpells, SelectedSpells, RemoveButtonLocked, AddButtonLocked);
            this.props.UpdateActiveUnit(SetUnitPsychicPowers(SelectedSpells));
        }
    }

    RemovePsychicPowers() {
        let AddButtonLocked;
        let RemoveButtonLocked;
        let SelectedSpells = this.props.SelectedSpells.slice();
        let AvailableSpells = this.props.AvailableSpells.slice();
        if(!_.isEmpty(this.ChosenSelectedSpells)) {
            this.ChosenSelectedSpells.forEach((element) => {
                if(!(this.props.KnowsSmite && element.id == 1)) {
                    SelectedSpells.splice(SelectedSpells.indexOf(element), 1);
                    AvailableSpells.push(element);
                }
            });
            RemoveButtonLocked = (!SelectedSpells || SelectedSpells.length == 0 || (SelectedSpells.length == 1 && SelectedSpells[0].id == 1));
            AddButtonLocked = false;
            this.ChosenAvailableSpells = [];
            this.ChosenSelectedSpells = [];
            this.props.SetPsychicPowerMenuButtons(AvailableSpells, SelectedSpells, RemoveButtonLocked, AddButtonLocked);
            this.props.UpdateActiveUnit(SetUnitPsychicPowers(SelectedSpells));
        }
    }

    render() {
        let RemoveButton;
        let AddButton;
        if(this.props.RemoveButtonLocked) {
            RemoveButton = <button disabled = {true} className = "EditUnitPsychicPowers__Button_Locked">{"<"}</button>
        } else {
            RemoveButton = <button className = "EditUnitPsychicPowers__Button" onClick = {this.RemovePsychicPowers.bind(this)}>{"<"}</button>
        }

        if(this.props.AddButtonLocked) {
            AddButton = <button disabled = {true} className = "EditUnitPsychicPowers__Button_Locked">{">"}</button>
        } else {
            AddButton = <button className = "EditUnitPsychicPowers__Button" onClick = {this.AddPsychicPowers.bind(this)}>{">"}</button>
        }

        return(
            <div className = "EditUnitPsychicPowers">
                <h2 className = "EditUnitPsychicPowers__Header">Edit Unit Psychic Powers</h2>
                <ChoiceUnitPsychicPower SelectLabel = "Available Psychic Powers" ChoosePsychicPowers = {this.ChooseAvailablePsychicPowers} AvailablePowers = {this.props.AvailableSpells}/>
                <div className = "EditUnitPsychicPowers__ButtonsDiv">
                    {AddButton}
                    {RemoveButton}
                </div> 
                <ChoiceUnitPsychicPower SelectLabel = "Selected Psychic Powers"  ChoosePsychicPowers = {this.ChooseSelectedPsychicPowers} AvailablePowers = {this.props.SelectedSpells}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AvailableSpells: state.PsychicPowerMenuButtons.AvailableSpells,
        SelectedSpells: state.PsychicPowerMenuButtons.SelectedSpells,
        RemoveButtonLocked: state.PsychicPowerMenuButtons.RemoveButtonLocked,
        AddButtonLocked: state.PsychicPowerMenuButtons.AddButtonLocked,
        MaxSpells: utils.GetCurrentNumberOfSpells(state.RosterEditing.ActiveUnit.BaseUnit.NumberOfSpells, state.RosterEditing.ActiveUnit.Models.length),
        KnowsSmite: state.RosterEditing.ActiveUnit.BaseUnit.KnowsSmite,
        Unit: state.RosterEditing.ActiveUnit  
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetPsychicPowerMenuButtons: (AvailableSpells, SelectedSpells, RemoveButtonLocked, AddButtonLocked) => dispatch(ActionCreators.PsychicPowerMenuButtons(AvailableSpells, SelectedSpells, RemoveButtonLocked, AddButtonLocked)),
        UpdateActiveUnit: (ResultObject) => dispatch(ActionCreators.UpdateActiveUnit(ResultObject))
    }
}

const containerEditUnitPsychicPowers = connect(
    mapStateToProps,
    mapDispatchToProps
)(EditUnitPsychicPowers);

export default containerEditUnitPsychicPowers;