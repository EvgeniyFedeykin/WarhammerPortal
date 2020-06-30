import React, {Component} from "react";
import "./EditUnitPsychicPowers.css";
import { CSSTransitionGroup } from 'react-transition-group';
const _ = require('lodash');

class ChoiceUnitPsychicPower extends Component {
    constructor(props) {
        super(props);
        this.ChoosePsychicPowers = this.ChoosePsychicPowers.bind(this);
    }
    ChoosePsychicPowers(event) {
        this.props.ChoosePsychicPowers(event);
    }

    render() {
        let AvailablePowers = this.props.AvailablePowers;
        let PsychicPowers = [];
        if(!!AvailablePowers && AvailablePowers.length > 0) {
            PsychicPowers = AvailablePowers.map(
                (power) =>
                    <option 
                        className = "EditUnitPsychicPowers__Option" 
                        key = {power.id} 
                        value = {power.id}
                    >
                        {power.Name}
                     </option>
            )
        }
        return (
            <div className = "EditUnitPsychicPowers__ChoiceDiv">
                <h3 className = "EditUnitPsychicPowers__Label">{this.props.SelectLabel}</h3>
                    <div className = "EditUnitPsychicPowers__SelectDiv">
                        <select
                            key = {!_.isEmpty(PsychicPowers) ? PsychicPowers.length: 0} 
                            className = "EditUnitPsychicPowers__Select" 
                            multiple = {true} 
                            onChange = {this.ChoosePsychicPowers.bind(this)} 
                            size = {6}>
                                {PsychicPowers}
                        </select>
                    </div>
            </div>
        )
    }
}

export default ChoiceUnitPsychicPower;