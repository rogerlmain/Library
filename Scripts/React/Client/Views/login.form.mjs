import "/Scripts/Library/Client/Common/prototypes.mjs";
import BaseControl from "/Scripts/Library/Client/Controls/base.control.mjs";
import FadePanel from "/Scripts/Library/Client/Controls/fade.panel.mjs";
export default class LoginForm extends BaseControl {
  constructor(props) {
    super(props);
    this.state.show_password = false;
  } // constructor;


  render() {
    return /*#__PURE__*/React.createElement(FadePanel, {
      id: this.props.id,
      name: "form",
      className: "login-form two-column-table",
      visible: this.props.visible
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-fields one-column-form"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Email"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "email",
      name: "email_address",
      defaultValue: this.props.default_email_address
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "password"
    }, "Password"), /*#__PURE__*/React.createElement("div", {
      className: "password-cell"
    }, /*#__PURE__*/React.createElement("input", {
      type: this.state.show_password ? "input" : "password",
      name: "password",
      defaultValue: this.props.default_password
    }), /*#__PURE__*/React.createElement("img", {
      src: this.state.show_password ? "Images/eyeball.off.svg" : "Images/eyeball.on.svg",
      className: "password-eyeball",
      onClick: () => {
        this.setState({
          show_password: !this.state.show_password
        });
      }
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: this.props.login
    }, "Login"));
  } // render;


} // LoginForm;