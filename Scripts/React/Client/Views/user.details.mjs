import BaseControl from "/Scripts/Library/Client/Controls/base.control.mjs";
export default class UserDetails extends BaseControl {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "user-details"
    }, /*#__PURE__*/React.createElement("div", null, "Hello ", this.props.user_details.handle, "!"));
  } // render;


} // UserDetails;