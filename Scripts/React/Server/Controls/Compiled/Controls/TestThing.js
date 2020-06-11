class TestThing extends react.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", {
      style: "border: solid 1px red"
    }, "The Test Thing");
  } // render;


} // TestThing;


react_dom.render( /*#__PURE__*/React.createElement(TestThing, {
  id: "a_test_thing",
  name: "Jerry"
}), document.body);