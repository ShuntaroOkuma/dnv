import Button from "@mui/material/Button";
import { DnvClient } from "../proto/dnv_grpc_web_pb";
import { GetRunScript } from "../proto/dnv_pb";
import { useState } from "react";
import { Typography } from "@mui/material";

export const ScriptArea = () => {
  const [networkLines, setNetworkLines] = useState([]);
  const [dockerLines, setDockerLines] = useState([]);

  const handleClick = () => {
    const dnvClient = new DnvClient("http://localhost:8080");

    const request = new GetRunScript();

    dnvClient.runScript(request, {}, (err, response) => {
      if (err) {
        console.log("Error: ");
        console.log(err);
      } else {
        console.log("Response: ");
        console.log(response);
        const script = response.getScriptresult();

        const sections = script.split("2. Docker Environment");
        const networkInfo = sections[0];
        const dockerInfo = sections[1];

        // ネットワーク情報を行に分ける
        const networkLines = networkInfo
          .split("\n")
          .filter((line) => line.trim() !== "");
        setNetworkLines(networkLines);

        // Docker情報を行に分ける
        const dockerLines = dockerInfo
          .split("\n")
          .filter((line) => line.trim() !== "");
        setDockerLines(dockerLines);
      }
    });
  };

  const onClick = () => {
    handleClick();
  };

  return (
    <>
      <h1>Script Area</h1>
      <Button variant="contained" onClick={onClick}>
        Run Script
      </Button>
      <div>
        <h2>Host Environment network</h2>
        <ul>
          {networkLines.map((line, index) => (
            <Typography key={index} variant="body1" textAlign="left">
              {line}
            </Typography>
          ))}
        </ul>

        <h2>Docker Environment Network</h2>
        <ul>
          {dockerLines.map((line, index) => (
            <Typography key={index} variant="body1" textAlign="left">
              {line}
            </Typography>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ScriptArea;
