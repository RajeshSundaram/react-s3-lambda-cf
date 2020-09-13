import React, { useState } from "react";
import "./App.css";
import { UploadForm } from "./uploader";
import { ViewForm } from "./viewer";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({
  header: {
    height: "100px",
    display: "flex",
    alignItems: "center",
  },
  nav: {
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  button: {
    width: "45%",
    height: 30,
    outline: "none",
    borderRadius: 10,
    border: "none",
    boxShadow: "1px 2px 3px 3px lightgrey",
    minWidth: "200px",
    marginTop: "0.5rem",
  },
  section: {
    border: "2px solid lightcoral",
    margin: "0px 5%",
  },
}));
type ViewType = "upload" | "view";
function App() {
  const styles = useStyles();
  const [viewType, setViewType] = useState<ViewType>("upload");
  const setView = (type: ViewType) => {
    return () => {
      setViewType(type);
    };
  };
  return (
    <div className="App">
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Button className={styles.button} onClick={setView("upload")}>
            Uploader
          </Button>
          <Button className={styles.button} onClick={setView("view")}>
            Viewer
          </Button>
        </nav>
      </header>
      <section className={styles.section}>
        {viewType === "upload" && <UploadForm />}
        {viewType === "view" && <ViewForm />}
      </section>
    </div>
  );
}
export default App;
