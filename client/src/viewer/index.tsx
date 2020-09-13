import * as React from "react";
import { FileContext } from "./../uploader";

const formStyle = {
  margin: "3%",
  background: "white",
  color: "brown",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

type ViewFormType = {
  dummy?: boolean;
};
export const ViewForm: React.FC<ViewFormType> = ({ dummy }: ViewFormType) => {
  const context = React.useContext(FileContext);
  const items: Array<File> = [];
  if (context.files) {
    for (let i = 0; i < context.files.length; i++) {
      items.push(context.files[i]);
    }
  }
  return (
    <div style={formStyle}>
      viewer {dummy}
      <ul>
        {items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};
