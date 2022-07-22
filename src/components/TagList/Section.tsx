import { useContext } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import LinearProgress from "@mui/material/LinearProgress";

import SectionItem from "./SectionItem";
import { TagsContext } from "./context";

interface SectionProps {
  sectionId: string;
  startIndex: number;
  stopIndex: number;
}

const Section: React.FC<SectionProps> = ({ sectionId, startIndex, stopIndex }) => {
  const tagSections = useContext(TagsContext);
  const section = tagSections[sectionId];
  const sectionCount = section.items.length;
  const itemHeight = 48;

  if (!section.loading && sectionCount === 0) {
    return null;
  }

  return (
    <li>
      <ul
        style={{
          position: "relative",
          padding: 0,
          height: (sectionCount + 1) * itemHeight,
        }}
      >
        <ListSubheader
          sx={{
            // this matches the drawer background
            bgcolor: "background.paper",
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
          }}
        >
          {section.name}
          {section.loading && <LinearProgress />}
        </ListSubheader>
        {section.items.slice(startIndex, stopIndex).map((item, index) => (
          <SectionItem key={item.id} sectionId={sectionId} index={index + startIndex} />
        ))}
      </ul>
    </li>
  );
};

export default Section;
