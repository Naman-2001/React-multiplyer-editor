import { useState, useEffect } from "react";

// import { Controlled as CodeMirror } from "react-codemirror2";
import CodeMirror from "codemirror";
import CodeMirrorConvergenceAdapter from "./codemirror-adapter";
import { Convergence } from "@convergence/convergence";
import defaultEditorContents from "./default_editor_contents";
import "./App.css";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/search/match-highlighter");
require("codemirror/addon/scroll/annotatescrollbar.js");
require("codemirror/addon/search/matchesonscrollbar.js");
require("codemirror/addon/search/searchcursor.js");
require("codemirror/addon/search/match-highlighter.js");
require("codemirror/theme/material-ocean.css");
require("codemirror/theme/neat.css");
require("codemirror/mode/xml/xml.js");
require("codemirror/mode/clike/clike.js");
require("codemirror/mode/python/python.js");
require("codemirror/mode/cmake/cmake.js");
require("codemirror/mode/javascript/javascript.js");
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/edit/closebrackets.js");
require("codemirror/addon/fold/foldgutter.js");
require("codemirror/addon/fold/foldgutter.css");
require("codemirror/addon/fold/brace-fold.js");
require("codemirror/addon/fold/comment-fold.js");
require("codemirror/addon/fold/indent-fold.js");
require("codemirror/addon/fold/markdown-fold.js");
require("codemirror/addon/fold/xml-fold.js");
require("codemirror/addon/comment/comment.js");

const CONVERGENCE_URL =
  "wss://api.demo.convergence.io/realtime/convergence/examples";

function App() {
  var convergenceExampleId = (function () {
    function createUUID() {
      let dt = new Date().getTime();
      const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    const url = new URL(window.location.href);
    let id = url.searchParams.get("id");
    if (!id) {
      id = createUUID();
      url.searchParams.append("id", id);
      window.history.pushState({}, "", url.href);
    }
    return id;
  })();

  function randomDisplayName() {
    return "User-" + Math.round(Math.random() * 10000);
  }

  function exampleLoaded() {
    console.log("hello world");
    const loading = document.getElementById("loading");
    if (loading.parentNode) {
      loading.parentNode.removeChild(loading);
    }

    const content = document.getElementById("example-content");
    content.style.visibility = "visible";
  }

  const username = randomDisplayName();
  console.log(username);
  useEffect(() => {
    Convergence.connectAnonymously(CONVERGENCE_URL, username)
      .then((domain) => {
        return domain.models().openAutoCreate({
          collection: "example-codemirror",
          // collection: "codemirror-pro",
          id: convergenceExampleId,
          data: { text: defaultEditorContents },
          ephemeral: true,
        });
      })
      .then((model) => {
        const editor = new CodeMirror(
          document.getElementById("codemirror-editor"),
          {
            mode: "javascript",
            theme: "material-ocean",
            value: defaultEditorContents,
            lineNumbers: true,
          }
        );
        console.log(model.elementAt("text").value());
        const adapter = new CodeMirrorConvergenceAdapter(
          editor,
          model.elementAt("text")
        );
        adapter.bind();

        exampleLoaded();
      })
      .catch((error) => {
        console.error("Could not open model ", error);
      });
  }, []);

  const [code, setCode] = useState("");
  return (
    <div>
      {/* <CodeMirror //output
        id="my-codemirror"
        name="code"
        value={code}
        editorDidMount={(editor) => {
          editor.setSize("", "40vh");
        }}
        options={{
          mode: "text/x-c++src",
          theme: "material-ocean",
          // lineNumbers: true,
          // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          // matchBrackets: true,
          // autoCloseBrackets: true,
        }}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
        }}
      /> */}
      <div className="wrapper">
        {/* Page Content */}
        <div id="content">
          {/* <div id="example"></div> */}
          <div id="loading">
            <h2>Loading</h2>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
          </div>
          <div
            className="example-content"
            id="example-content"
            style={{ visibility: "hidden" }}
          >
            <div className="wrapped-editor">
              <div
                className="editor"
                id="codemirror-editor"
                style={{ height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
