import React, {Component} from 'react'

export default class CircleDiv extends Component {
    render() {
        let omjer = 0;
        (this.props.number > 0) ? (omjer = this.props.largestNumber() / this.props.number) : omjer = 136*136;//if number=0 => promjer=1
        const promjer = 136 / Math.sqrt(omjer); // todo: 136 je promjer najvećeg kruga
        const diametar = (promjer < 10 ? 10 : promjer); // ne može biti manje od 10px

        const diametar2 = (0.8 * promjer < 10 ? 10 : 0.8 * promjer); // za lg ekrane
        const diametar3 = (0.6 * promjer < 10 ? 10 : 0.6 * promjer); // za md ekrane

        const color = this.props.number > 0 ? this.props.color : "greybackground"; //sivi ako je nula
        return (
            <div className={"CircleDiv"}>
                <div className="CircleDiv-circle d-none d-xl-flex">
                    <div className={"circle " + color} style={{width: diametar, height: diametar}}></div>
                </div>
                <div className="CircleDiv-circle d-none d-lg-flex d-xl-none">
                    <div className={"circle " + color} style={{width: diametar2, height: diametar2}}></div>
                </div>
                <div className="CircleDiv-circle d-none d-md-flex d-lg-none">
                    <div className={"circle " + color} style={{width: diametar3, height: diametar3}}></div>
                </div>
                <div className="CircleDiv-circle d-sm-flex d-md-none">
                    <div className={"circle " + color} style={{width: diametar3, height: diametar3}}></div>
                </div>
                <div className="CircleDiv-number">{this.props.number}</div>
                <div className="CircleDiv-text">
                    {(this.props.color === "coral") ? "imovinsko-pravne" : ""}
                    {(this.props.color === "periwinkle") ? "poslovne" : ""}
                    {(this.props.color === "dodger-blue") ? "političke" : ""}
                    {(this.props.color === "weird-green") ? "obiteljske" : ""}
                    {(this.props.color === "sunshine-yellow") ? "interesne" : ""}
                </div>
            </div>
        )
    }
}