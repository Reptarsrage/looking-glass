import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Container from "@mui/material/Container";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";

import { PreferredTheme, SettingsContext } from "../store/settings";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const [version, setVersion] = useState("");
  const [os, setOs] = useState("");

  useEffect(() => {
    async function getVersion() {
      const version = await window.versions.app();
      const os = await window.versions.os();

      setVersion(version);
      setOs(os);
    }

    getVersion();
  });

  const { videoAutoPlay, videoLowDataMode, pictureLowDataMode, masonryColumnCount, preferredTheme } = settings.settings;

  const onChecked = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    settings.setSettings({
      ...settings.settings,
      [event.currentTarget.name]: checked,
    });
  };

  const onChange = (name: string) => (event: Event, value: number | number[]) => {
    settings.setSettings({ ...settings.settings, [name]: value });
  };

  const onThemeChange = (event: SelectChangeEvent<PreferredTheme>) => {
    if (typeof event.target.value !== "string") {
      settings.setSettings({ ...settings.settings, preferredTheme: event.target.value });
    }
  };

  const onClick = () => {
    navigate(-1);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 4 }}>
      <Zoom in unmountOnExit>
        <Fab color="default" onClick={onClick} sx={{ position: "absolute", right: "8px" }}>
          <CloseIcon />
        </Fab>
      </Zoom>

      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend" sx={{ mt: 4 }}>
          Theme
        </FormLabel>
        <FormGroup>
          <Select id="theme-select" value={preferredTheme} label="Theme" onChange={onThemeChange}>
            <MenuItem value={PreferredTheme.Default}>System Default</MenuItem>
            <MenuItem value={PreferredTheme.Light}>Light</MenuItem>
            <MenuItem value={PreferredTheme.Dark}>Dark</MenuItem>
          </Select>
        </FormGroup>

        <FormLabel component="legend" sx={{ mt: 4 }}>
          Video Settings
        </FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={videoLowDataMode} name="videoLowDataMode" onChange={onChecked} />}
            label="Low Data Mode"
          />

          <FormControlLabel
            control={<Switch checked={videoAutoPlay} name="videoAutoPlay" onChange={onChecked} />}
            label="Auto-Play"
          />
        </FormGroup>

        <FormLabel component="legend" sx={{ mt: 4 }}>
          Picture Settings
        </FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={pictureLowDataMode} name="pictureLowDataMode" onChange={onChecked} />}
            label="Low Data Mode"
          />
        </FormGroup>

        <FormLabel component="legend" sx={{ mt: 4 }}>
          Masonry Settings
        </FormLabel>
        <Typography id="column-slider" gutterBottom sx={{ mt: 1 }}>
          Columns
        </Typography>
        <Box sx={{ width: 300 }}>
          <Slider
            aria-labelledby="column-slider"
            defaultValue={4}
            step={1}
            marks
            min={1}
            max={10}
            valueLabelDisplay="auto"
            value={masonryColumnCount}
            onChange={onChange("masonryColumnCount")}
          />
        </Box>

        <FormLabel component="legend" sx={{ mt: 4 }}>
          Version Info
        </FormLabel>
        <Typography sx={{ mt: 1 }}>Version: {version}</Typography>
        <Typography>Node.js: {window.versions.node()}</Typography>
        <Typography>Chromium: {window.versions.chrome()}</Typography>
        <Typography>Electron: {window.versions.electron()}</Typography>
        <Typography>V8: {window.versions.v8()}</Typography>
        <Typography>OS: {os}</Typography>
      </FormControl>
    </Container>
  );
};
export default SettingsPage;
