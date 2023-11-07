import { Grid, Typography } from "@mui/material";
import mermaid from "mermaid";
import { useRef, useEffect, useState } from "react";

export function Mermaid({ src }) {
  const ref = useRef(null);
  const [valid, setValid] = useState(false);
  const [svg, setSvg] = useState(null);

  const parseSrc = async (src) => {
    const result = mermaid.parse(src);
    return result;
  };

  const renderSrc = async (src) => {
    const { svg } = await mermaid.render("dnv-svg", src);
    return svg;
  };

  useEffect(() => {
    if (src) {
      mermaid.init({}, ref.current);

      const parse = async () => {
        const result = await parseSrc(src).catch((err) => {
          console.error("parse error:", err);
          setValid(false);
        });
        console.log("parse:");
        console.log(result);
        setValid(result);
      };
      parse();
    }
  }, [src]);

  useEffect(() => {
    if (src) {
      mermaid.init({}, ref.current);

      if (valid) {
        setValid(true);
        const draw = async () => {
          const svg = await renderSrc(src);
          setSvg(svg);
        };
        draw();
      } else {
        console.error("Failed to parse mermaid source");
      }
    }
  }, [src, valid]);

  return valid ? (
    <div>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        alt="loading..."
        width={1000}
        height={500}
      />
    </div>
  ) : (
    <>
      <div>Failed to parse Mermaid... Mermaid src is below:</div>
      <Grid item width={100} display="flex" alignItems="center">
        <Typography variant="body1" textAlign="left">
          {src}
        </Typography>
      </Grid>
    </>
  );
}
