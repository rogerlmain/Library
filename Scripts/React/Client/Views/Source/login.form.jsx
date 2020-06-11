import "/Scripts/Library/Client/Common/prototypes.mjs";

import BaseControl from "/Scripts/Library/Client/Controls/base.control.mjs";
import FadePanel from "/Scripts/Library/Client/Controls/fade.panel.mjs";


export default class LoginForm extends BaseControl {


	constructor (props) {
		super (props);
		this.state.show_password = false;
	}// constructor;


	render () {

		return (

			<FadePanel id={this.props.id} name="form" className="login-form two-column-table" visible={this.props.visible}>

				<div className="form-fields one-column-form">

					<label htmlFor="username">Email</label>
					<input type="text" id="email" name="email_address" defaultValue={this.props.default_email_address} />

					<label htmlFor="password">Password</label>

					<div className="password-cell">
						<input type={this.state.show_password ? "input" : "password"} name="password" defaultValue={this.props.default_password} />
						<img src={this.state.show_password ? "Images/eyeball.off.svg" : "Images/eyeball.on.svg"} className="password-eyeball" onClick={() => { this.setState ({ show_password: !this.state.show_password}); }} />
					</div>

				</div>

				<button onClick={this.props.login}>Login</button>

			</FadePanel>

		);

	}// render;


}// LoginForm;

