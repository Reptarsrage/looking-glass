import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { styled, alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";

import { useModalStore } from "../store/modal";
import useAppSearchParams from "../hooks/useAppSearchParams";
import useDebounce from "../hooks/useDebounce";
import { useDrawerStore } from "../store/drawer";

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
  const [searchParams, setSearchParams] = useAppSearchParams();
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);
  const drawerIsOpen = useDrawerStore((state) => state.open);
  const [query, setQuery] = useState(searchParams.query);

  // Keep state in parity with search params
  useEffect(() => {
    setQuery(searchParams.query);
  }, [searchParams]);

  const setSearchParamsDebounced = useDebounce(setSearchParams, 300);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const query = event.currentTarget.value;
    setQuery(query);
    setSearchParamsDebounced({ ...searchParams, query });
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    if (event.key === "Escape") {
      setQuery("");
      setSearchParamsDebounced({ ...searchParams, query: "" });
    }
  };

  return (
    <Fade in={!modalIsOpen && !drawerIsOpen}>
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
