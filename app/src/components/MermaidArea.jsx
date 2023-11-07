import React from "react";
import Button from "@mui/material/Button";
import { DnvClient } from "../proto/dnv_grpc_web_pb";
import { GetRunScript } from "../proto/dnv_pb";
import { GetMermaidRequest } from "../proto/dnv_pb";
import { Mermaid } from "./Mermaid";
import { Grid } from "@mui/material";

const convertStringToObject = (str) => {
  const trimmedStr = str.trim();

  const patternSections = trimmedStr.split(/(?=pattern\d+:)/g);
  patternSections.shift(); // remove first empty element

  const result = {};
  patternSections.forEach((section) => {
    if (section === "") return; // ignore empty section

    const [patternName, ...values] = section.split(/:\s*/);
    const cleanPatternName = patternName.trim();
    const cleanValues = values.join(":").trim();

    result[cleanPatternName] = cleanValues;
  });

  return result;
};

const MermaidArea = () => {
  const [loading, setLoading] = React.useState(false);
  const [scriptResult, setScriptResult] = React.useState("");
  const [mermaids, setMermaids] = React.useState({});

  // English
  const gptRequest = `
    - Output 3 patterns that can be selected. However, all patterns must meet all requirements
    - The output must only display the text in the format of pattern number: mermaid text without any extra characters. No backquotes are required
      - For example, the output should be as follows
      pattern1:
      graph LR
        subgraph docker0
          eth0-veth[eth0:veth, IP: 172.17.0.2]
          vethdb8-veth[vethdb8:veth, IP: 172.17.0.1]
          container1[container1, IP: 172.17.0.2]
        end
      pattern2:
      graph LR
        subgraph docker0
          eth0-veth[eth0:veth, IP: 172.17.0.2]
          vethdb8-veth[vethdb8:veth, IP: 172.17.0.1]
          container1[container1, IP: 172.17.0.2]
        end
    - Organize the information by bridge, then consolidate it and convert it into mermaid format.
    - Clearly denote the interface names, types, and IP addresses.
    - Represent as many communication routes as possible, such as through loopback.
    - Use subgraphs to ensure all elements are contained within a subgraph.
    - Represent the host and containers as separate domains.
    - Illustrate the connection going out to the Internet.
    - Display all operating containers.
    - Ensure there are no Syntax Errors with the Mermaid format.
  `;

  // Japanese
  // const gptRequest = `
  //   ・好みを選べるよう３パターン出力すること。ただし、どのパターンも全ての要望を満たすこと
  //   ・出力には、余計な文字は表示させず、パターン番号: mermaid文 という形式のテキストのみ出力すること。バッククォートなども不要
  //     ・例えば以下のような出力とすること
  //       pattern1:
  //       graph LR
  //         subgraph docker0
  //           eth0-veth[eth0:veth, IP: 172.17.0.2]
  //           vethdb8-veth[vethdb8:veth, IP: 172.17.0.1]
  //           container1[container1, IP: 172.17.0.2]
  //         end
  //       pattern2:
  //       graph LR
  //         subgraph docker0
  //           eth0-veth[eth0:veth, IP: 172.17.0.2]
  //           vethdb8-veth[vethdb8:veth, IP: 172.17.0.1]
  //           container1[container1, IP: 172.17.0.2]
  //         end
  //   ・bridgeごとに情報を整理し、その後に統合し、mermaid形式に変換すること
  //   ・インターフェース名、type、IPアドレスを明記すること
  //   ・loopbackなどできる限り多くの通信経路を表現すること
  //   ・subgraphを使い、全ての要素がsubgraphの中に入るようにすること
  //   ・Hostとコンテナは別領域として表現すること
  //   ・Internetへ出ていくよう表現すること
  //   ・稼働しているコンテナは全て表現すること
  //   ・MermaidのSyntax Errorが出ないようにすること
  //   `;

  const handleClick = async () => {
    setLoading(true);

    const dnvClient = new DnvClient("http://localhost:8080");

    // Run script and set result
    const ScriptRequest = new GetRunScript();

    dnvClient.runScript(ScriptRequest, {}, (err, response) => {
      if (err) {
        console.log("Error: ");
        console.log(err);
      } else {
        console.log("Response: ");
        console.log(response);
        setScriptResult(response.getScriptresult());
      }
    });

    // Request mermaid
    const request = new GetMermaidRequest();
    request.setScriptresult(scriptResult);
    request.setGptrequest(gptRequest);

    await dnvClient.getMermaid(request, {}, (err, response) => {
      if (err) {
        console.log("Error: ");
        console.log(err);
      } else {
        const result = response.getMermaid();
        const mermaid = convertStringToObject(result);
        console.log("Mermaid: ");
        console.log(mermaid);
        setMermaids(mermaid);
      }
    });

    // For test
    // setMermaids({
    //   pattern1: `graph TB
    // subgraph host
    // Host1_bridged[(Host1:eth0:192.168.1.2)]
    // Host1_loopback[(Host1:lo:127.0.0.1)]
    // Host1_bridged --> Internet
    // end
    // subgraph containers
    // Container1_bridged[(Container1:eth0:192.168.1.3)]
    // Container1_loopback[(Container1:lo:127.0.0.1)]
    // Container2_bridged[(Container2:eth0:192.168.1.4)]
    // Container2_loopback[(Container2:lo:127.0.0.1)]
    // end
    // Host1_bridged --> Container1_bridged
    // Container1_bridged --> Container2_bridged
    // Container1_loopback --> Container2_loopback`,
    //   pattern2: `graph TB
    // subgraph host
    // Host1_bridged[(Host1:eth0:192.168.1.2)]
    // Host1_loopback[(Host1:lo:127.0.0.1)]
    // Host1_bridged -->>> Internet
    // end
    // subgraph containers
    // Container1_bridged[(Container1:eth0:192.168.1.3)]
    // Container1_loopback[(Container1:lo:127.0.0.1)]
    // Container2_bridged[(Container2:eth0:192.168.1.4)]
    // Container2_loopback[(Container2:lo:127.0.0.1)]
    // end
    // Host1_bridged --> Container1_bridged
    // Container1_bridged --> Container2_bridged
    // Container1_loopback --> Container2_loopback`,
    // });

    setLoading(false);
  };

  const onClick = () => {
    handleClick();
  };

  const MermaidComponent = () => {
    return (
      <div>
        {Object.keys(mermaids).map((key) => (
          <>
            <h3>{key}</h3>
            <Mermaid key={key} src={mermaids[key]} />
          </>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Mermaid Area</h1>
      <Button variant="contained" onClick={onClick}>
        Create Mermaid
      </Button>
      <Grid
        container
        spacing={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={10}
      >
        {loading ? <p>Loading...</p> : <MermaidComponent />}
      </Grid>
    </div>
  );
};

export default MermaidArea;
