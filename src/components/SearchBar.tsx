import { useState, useEffect, useContext } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";

import { FullscreenContext } from "../store/fullscreen";

const Search = styled("div")(({ theme }) => ({
  WebkitAppRegion: "no-drag",
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: (theme.transitions as any).create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchBar: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fullscreen } = useContext(FullscreenContext);
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const isShown = /^\/(search|gallery)/.test(location.pathname);

  // Keep state in parity with search params
  useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setQuery(event.currentTarget.value);
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    if (event.key === "Escape") {
      setQuery("");
    } else if (event.key === "Enter") {
      searchParams.set("query", query);
      setSearchParams(searchParams);
    }
  };

  return (
    <Fade in={!fullscreen && isShown}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={query}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          disabled={false}
        />
      </Search>
    </Fade>
  );
};

export default SearchBar;
