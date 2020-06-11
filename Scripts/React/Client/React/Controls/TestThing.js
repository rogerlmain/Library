class TestThing extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: "solid 1px red"
      }
    }, "The Test Thing");
  } // render;


} // TestThing;


document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render( /*#__PURE__*/React.createElement(TestThing, {
    id: "my_test_thing",
    name: "Jerry"
  }), document.getElementById("test_thing"));
});