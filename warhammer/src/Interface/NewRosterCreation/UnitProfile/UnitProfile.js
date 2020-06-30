import React, {Component} from "react";
import "./UnitProfile.css";

class UnitProfile extends Component {
    constructor(props) {
        super(props);
        this.handleUnitSelection = this.handleUnitSelection.bind(this);
    }

    handleUnitSelection = () => {
        this.props.handleUnitSelection(this.props.Unit);
    }

    render() {
        var AddButton = (this.props.UnitSelection && (
        (this.props.AllowedAdding) ? (
                <button className = "UnitProfile__Button UnitProfile__Float" onClick = {this.handleUnitSelection}>ADD</button>
            ) : (
                <button className = "UnitProfile__Button UnitProfile__Float" disabled = {true}>ADD</button>)
            )
        );
        return(
            <div className = "UnitProfile__Block">
                <div className = "UnitProfile__Image_block">
                    <img className="UnitProfile__Image" src={this.props.Unit.Image} alt = {this.props.Unit.Name} />
                    <div className = "UnitProfile__Button_block">
                        {AddButton}
                        <div><a href={this.props.Unit.ExternalURL} target="_blank"><button  className = "UnitProfile__Button">VIEW</button></a></div>
                    </div>
                </div>
                <div className = "UnitProfile__Header_block">
                    <img className = "UnitProfile__Header_image" src= {this.props.Unit.UnitRole.Image} alt={this.props.Unit.UnitRole.Name} />
                    <img className = "UnitProfile__Header_image" src= {this.props.Unit.Faction.FactionLogo} alt={this.props.Unit.Faction.Name} />
                    <div className = "UnitProfile__Header_div"><h3 className = "UnitProfile__Header">{this.props.Unit.Name}</h3></div>
                </div>
                <p className = "UnitProfile__UnitDescription">{this.props.Unit.Description}</p>
            </div>
        );
    }
}

export default UnitProfile;