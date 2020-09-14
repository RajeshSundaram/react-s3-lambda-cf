import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { PlayForWork, VideoLabel } from "@material-ui/icons";
import * as React from "react";
import { Player } from "../components/player";

import debounce from "lodash/debounce";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    padding: "1rem",
    gridGap: "1rem",
    minHeight: 250,
  },
  playerContainer: {
    display: "flex",
    alignItems: "center",
  },
  filesListContainer: {
    minHeight: 250,
    "& .username": {
      display: "grid",
      gridTemplateColumns: "60% 30%",
      gridColumnGap: "1rem",
      "& .submit-button": {
        margin: "1rem",
      },
    },
    "& .files-list-container": {
      height: 0,
      opacity: 0,
      transition: "opacity 0.3s linear, height 0.5s ease-in-out",
      "&.show": {
        height: "revert",
        opacity: 1,
      },
    },
    "& .files-list-container .files-list": {
      border: "1px solid rebeccapurple",
      maxHeight: 400,
      overflowY: "scroll",
      "& .list-item": {
        "&:hover": {
          background: "#c6adde",
        },
        cursor: "pointer",
      },
    },
  },
}));

type ViewFormType = {
  dummy?: boolean;
};
export const ViewForm: React.FC<ViewFormType> = ({ dummy }: ViewFormType) => {
  const classes = useStyles();
  const [fileList, setFilesList] = React.useState<Array<string>>([]);
  const [username, setUsername] = React.useState("");
  const [videoURL, setVideoURL] = React.useState("");
  React.useEffect(() => {
    listFiles();
  }, []);

  const listFiles = () => {
    fetch(`${process.env.REACT_APP_FILE_API_DOMAIN}/list?username=${username}`)
      .then((res) => res.json())
      .then((res: any) => {
        setFilesList(res.items as Array<string>);
      });
  };

  const readFile = async (fileKey) => {
    const res = await fetch(
      `${process.env.REACT_APP_FILE_API_DOMAIN}/read?fileKey=${fileKey}`,
      { method: "GET" }
    );
    const url = (await res.json()).url;
    setVideoURL(url);
  };
  return (
    <div className={classes.container}>
      <div className={classes.filesListContainer}>
        <div className="username">
          <TextField
            required
            label="Username"
            defaultValue={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            className="submit-button"
            color="primary"
            variant="contained"
            // disabled={!username}
            onClick={listFiles}
            startIcon={<PlayForWork />}
          >
            Fetch
          </Button>
        </div>
        <div
          className={`files-list-container ${fileList.length ? "show" : ""}`}
        >
          <List className="files-list" color="primary">
            {fileList.map((it) => (
              <ListItem
                key={it}
                onClick={() => readFile(it)}
                className="list-item"
              >
                <ListItemIcon>
                  <VideoLabel />
                </ListItemIcon>
                <ListItemText>{it}</ListItemText>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <div className={classes.playerContainer}>
        {videoURL && <Player url={videoURL} />}
      </div>
    </div>
  );
};
