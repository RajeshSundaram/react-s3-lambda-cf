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
import { FileContext } from "./../uploader";

const useStyles = makeStyles(() => ({
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    padding: "1rem",
    gridGap: "1rem",
    minHeight: 250,
  },
  playerContainer: {},
  filesListContainer: {
    "& .username": {
      display: "grid",
      gridTemplateColumns: "60% 30%",
      gridColumnGap: "1rem",
      "& .submit-button": {
        margin: "1rem",
      },
    },
    "& .files-list-container": {
      // opacity: 0,
      display: "none",
      transform: "translateX(-200%)",
    },
    "& .files-list-container .files-list": {
      border: "1px solid rebeccapurple",
    },
  },
}));

const getListPresignedUrl = async (username: string): Promise<string> => {
  return "";
};

type ViewFormType = {
  dummy?: boolean;
};
export const ViewForm: React.FC<ViewFormType> = ({ dummy }: ViewFormType) => {
  const classes = useStyles();
  const [username, setUsername] = React.useState("");
  const fetchFiles = async () => {
    const url = await getListPresignedUrl(username);
    const filesList = await fetch(url, { method: "GET" });
    console.log(filesList);
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
            disabled={!username}
            onClick={fetchFiles}
            startIcon={<PlayForWork />}
          >
            Fetch
          </Button>
        </div>
        <div className="files-list-container">
          <List className="files-list">
            <ListItem>
              <ListItemIcon>
                <VideoLabel />
              </ListItemIcon>
              <ListItemText>Hello</ListItemText>
            </ListItem>
          </List>
        </div>
      </div>
      <div className={classes.playerContainer}>
        <Player />
      </div>
    </div>
  );
};
