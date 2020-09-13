import React from "react";
import TextField from "@material-ui/core/TextField";
import { FileContext } from "../uploader";

export const UserAccount: React.FC = () => {
  const { username, setUsername } = React.useContext(FileContext);
  return (
    <div>
      <TextField
        required
        label="Username"
        onChange={(event) => {
          setUsername && setUsername(event.target.value);
        }}
        defaultValue={username}
      />
    </div>
  );
};
