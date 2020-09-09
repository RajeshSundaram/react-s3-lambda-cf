import React from "react";
import "./App.css";

const formStyle = {
  height: "50vh",
  width: "100vw",
  margin: "3%",
  background: "white",
  color: "brown",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const UploadForm: React.FC = () => {
  const [files, setFiles] = React.useState<FileList | null>(null);
  const fileUpload = () => {
    if (files) {
      console.log("uploading");
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
      const api = process.env.REACT_APP_UPLOAD_FILES_API;
      if (!api) {
        throw new Error("invalid API");
      }
      fetch(api, {
        method: "POST",
        body: formData,
      }).then((res) => {
        console.log(res);
      });
    } else {
      console.error("no files selected");
    }
  };
  const onFilesSelect = (event: any) => {
    setFiles(event.target.files);
  };
  return (
    <div style={formStyle}>
      <input type="file" name="file" multiple onChange={onFilesSelect} />
      <input type="button" name="upload" onClick={fileUpload} value="upload" />
    </div>
  );
};
const ViewForm: React.FC = () => {
  const [files, setFiles] = React.useState([]);
  React.useEffect(() => {
    console.log("fetching files");
  });
  return <div style={formStyle}>files</div>;
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UploadForm />
        <ViewForm />
      </header>
    </div>
  );
}

export default App;
