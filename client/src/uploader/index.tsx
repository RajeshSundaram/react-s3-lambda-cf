import * as React from "react";
import { UploadIcon } from "./uploadIcon";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Button, Fab, makeStyles } from "@material-ui/core";
import { UserAccount } from "./../components/user-account";

export type FileUploadStatus = "set-in-motion" | "progress" | "done";
type FileContextType = {
  username: string;
  files: Array<File>;
  uploadStatus: FileUploadStatus;
  setUsername?: (name: string) => void;
  changeFiles?: (FileList: FileList | null) => void;
  setUploadStatus?: (status: FileUploadStatus) => void;
};

export const FileContext = React.createContext<FileContextType>({
  username: "",
  uploadStatus: "set-in-motion",
  files: [],
});

const useStyles = makeStyles(() => ({
  wrapper: {
    margin: "3%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    justifyItems: "center",
    alignItems: "center",
    gridRowGap: "1rem",
    gridColumnGap: "1rem",
  },

  fileSelectViewWrapper: {
    display: "flex",
    justifyContent: "space-around",
  },
  fileSelectWrapper: {
    "& .file-selector-button": {
      color: "white",
      background: "rebeccapurple",
      borderRadius: 10,
      cursor: "pointer",
      "&:hover": {
        background: "#50168a",
      },
    },
    "& .file-selector": {
      display: "none",
    },
  },
  fileViewWrapper: {
    maxHeight: 400,
    overflow: "scroll",
  },
  fileUploadWrapper: {
    justifySelf: "end",
    "& button": {
      color: "#fff",
      opacity: 0,
      transform: "translate(500%)",
      transition: "all 0.3s ease-in-out",
      backgroundColor: "#3f51b5",
      "&.show": {
        opacity: 1,
        transform: "translate(0%)",
      },
    },
  },
  list: {
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    paddingInlineStart: 0,
    width: "100%",
    padding: "0.4em",
  },
  listItem: {
    textAlign: "start",
    fontSize: "1.4rem",
    display: "grid",
    alignItems: "center",
    gridTemplateColumns: "15% 85%",
    textShadow: "0px 0px 1px",
    "& .file": {
      paddingInlineStart: "1rem",
    },
    "& .upload-status": {
      textAlign: "center",
    },
  },
  noFilesFound: {
    fontSize: "1.6rem",
    color: "rebeccapurple",
  },
}));

type UploadFormType = {
  callback?: (f: FileList) => void;
};

type FileUploadReqBody = {
  username: string;
  files: Array<{ name: string; type: string }>;
};

const FileContextProvider: React.PropsWithChildren<any> = (
  props: React.PropsWithChildren<any>
) => {
  const [name, setUserState] = React.useState("");
  const [files, setFiles] = React.useState<Array<File>>([]);
  const [uploadSt, setUpload] = React.useState<FileUploadStatus>(
    "set-in-motion"
  );
  const changeUploadStatus = (status: FileUploadStatus) => {
    setUpload(status);
  };
  const changeFiles = (newFiles: FileList | null) => {
    const items: Array<File> = [];
    if (newFiles) {
      for (let i = 0; i < newFiles.length; i++) {
        items.push(newFiles[i]);
      }
    }
    setFiles(items);
    if (items.length) {
      setUpload("set-in-motion");
    }
  };
  const setUsername = (name: string) => {
    setUserState(name);
  };
  return (
    <FileContext.Provider
      value={{
        username: name,
        setUsername,
        files,
        uploadStatus: uploadSt,
        changeFiles,
        setUploadStatus: changeUploadStatus,
      }}
    >
      {props.children}
    </FileContext.Provider>
  );
};

export const UploadForm: React.FC<UploadFormType> = ({
  callback,
}: UploadFormType) => {
  const styles = useStyles();

  const mediaUpload = (context: FileContextType) => {
    const { username, files, setUploadStatus } = context;
    const api = process.env.REACT_APP_UPLOAD_FILES_API;
    if (!api) {
      throw new Error("invalid API");
    }
    setUploadStatus && setUploadStatus("progress");
    if (files.length) {
      const reqBody: FileUploadReqBody = {
        username,
        files: files.map(({ name, type }) => ({ name, type })),
      };
      console.log("mediaUpload -> reqBody", reqBody);
      fetch(api, {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          const { files: resFiles } = res as {
            files: Array<{ name: string; url: string }>;
          };
          Promise.all(
            resFiles.map(async ({ name, url }) => {
              await fetch(url, {
                method: "PUT",
                body: files.find((f) => f.name === name),
              });
            })
          )
            .then(() => {
              console.log("upload done");
              setUploadStatus && setUploadStatus("done");
            })
            .catch((err) => console.error(err));
        });
    } else {
      console.error("no files selected");
    }
  };

  return (
    <FileContextProvider>
      <div className={`${styles.wrapper}`}>
        <FileSelectorContainer />
        <FileUploadStatusViewer />
        <UserAccount />
        <div className={styles.fileUploadWrapper}>
          <FileContext.Consumer>
            {(context) => (
              <Fab
                className={`${
                  context.username && context.files.length > 0 ? "show" : ""
                }`}
                color="primary"
                type="submit"
                onClick={() => {
                  mediaUpload(context);
                }}
              >
                <CloudUploadIcon />
              </Fab>
            )}
          </FileContext.Consumer>
        </div>
      </div>
    </FileContextProvider>
  );
};

const FileSelectorContainer: React.FC = () => {
  const styles = useStyles();
  const context = React.useContext(FileContext);
  return (
    <div
      className={`${styles.fileSelectViewWrapper} ${styles.fileSelectWrapper}`}
    >
      <Button
        variant="contained"
        component="label"
        className="file-selector-button"
      >
        SELECT FILES
        <input
          className="file-selector"
          type="file"
          name="file"
          multiple
          onChange={(event) =>
            context.changeFiles && context.changeFiles(event.target.files)
          }
          accept={process.env.REACT_APP_ALLOWED_FILE_TYPES}
        />
      </Button>
    </div>
  );
};

const FileUploadStatusViewer: React.FC = () => {
  const context = React.useContext(FileContext);
  const styles = useStyles();

  return (
    <div
      className={`${styles.fileSelectViewWrapper} ${styles.fileViewWrapper}`}
    >
      {context.files.length > 0 && (
        <ul className={styles.list}>
          {context.files.map((item) => (
            <li className={styles.listItem} key={item.name}>
              <span className="upload-status">
                <UploadIcon progress={context.uploadStatus} />
              </span>
              <span className="file">{item.name}</span>
            </li>
          ))}
        </ul>
      )}
      {context.files.length === 0 && (
        <span className={styles.noFilesFound}>No files found</span>
      )}
    </div>
  );
};
