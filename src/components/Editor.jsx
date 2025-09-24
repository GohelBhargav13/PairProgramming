import React, { use, useEffect, useRef, useState } from "react";
import CodeMirror from "codemirror";
import ACTIONS from "../Actions";

// IMPORT THE MAIN CSS FILE
import "codemirror/lib/codemirror.css";

// IMPORT THE JAVASCRIPT MODE
import "codemirror/mode/javascript/javascript.js";

//IMPORT THE THEME
import "codemirror/theme/rubyblue.css";

//IMPORT ADDONS
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";
import toast from "react-hot-toast";

function Editor({ sockerRef, roomId, OncodeChange }) {
  console.log(sockerRef);
  // A REFERENCE TO THE EDITOR
  const editorRef = useRef(null);
  const [user, setuser] = useState(null);

  useEffect(() => {
    async function init() {
      const codemirrorOp = {
        mode: { name: "javascript", json: true },
        theme: "rubyblue",
        autoCloseBrackets: true,
        autoCloseTags: true,
        lineNumbers: true,
      };

      editorRef.current = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        codemirrorOp
      );
      editorRef.current.on("change", (instance, changes) => {
        // console.log(changes);

        //DESTRUCTURE THE ORIGINS FROM CHANGES OBJECT FOR THE CODE
        const { origin } = changes;
        const code = instance.getValue();
        // console.log(code);
        OncodeChange(code);

        if (origin !== "setValue") {
          sockerRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (sockerRef.current) {
      sockerRef.current.on(ACTIONS.CODE_CHANGE, ({ code, user }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setuser(user);
          console.log(code);
        }
      });
    }
  }, [sockerRef.current, user]);

  return (
  
      <textarea id="realTimeEditor"></textarea>

  );
}

export default Editor;
