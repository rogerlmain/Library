import BaseControl from "/Scripts/Library/Client/Controls/base.control.mjs";
import UserDetails from "/Scripts/Library/Client/Views/user.details.mjs";
import DefaultLoginForm from "/Scripts/Library/Client/Views/login.form.mjs";
export default class UserLogin extends BaseControl {
  render() {
    alert(this.props.panel);
    let LoginForm = coalesce(this.props.login_form, DefaultLoginForm); //		if (isset (user_data)) return (<UserDetails user_details={user_data} />);

    return /*#__PURE__*/React.createElement(LoginForm, {
      id: this.props.id,
      default_email_address: this.props.default_email_address,
      default_password: this.props.default_password,
      panel: this.props.panel,
      main_page: this.props.main_page
    });
  } // render;


} // UserLogin;