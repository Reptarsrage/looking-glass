import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListSubheader from "@mui/material/ListSubheader";
import LinearProgress from "@mui/material/LinearProgress";

import SectionItem from "./SectionItem";
import { TagsContext } from "./context";
import { useTagsStore } from "../../store/tag";
import { useAuthStore } from "../../store/auth";
import * as lookingGlassService from "../../services/lookingGlassService";
import * as fileSystemService from "../../services/fileSystemService";
import { FILE_SYSTEM_MODULE_ID } from "../../store/module";
import { Tag } from "../../store/tag";

interface SectionProps {
  sectionId: string;
  startIndex: number;
  stopIndex: number;
}

const Section: React.FC<SectionProps> = ({ sectionId, startIndex, stopIndex }) => {
  const moduleId = useParams().moduleId!;
  const setTags = useTagsStore((state) => state.setTags);
  const setAuth = useAuthStore((state) => state.setAuth);
  const auth = useAuthStore(useCallback((s) => s.authByModule[moduleId], [moduleId]));
  const setTagSectionLoading = useTagsStore((s) => s.setTagSectionLoading);
  const tagSections = useContext(TagsContext);
  const section = tagSections[sectionId];

  // Effect to fetch all sections
  useEffect(() => {
    async function fetchTagSectionItems() {
      if (!moduleId) {
        return;
      }

      try {
        let response: Tag[];
        if (moduleId === FILE_SYSTEM_MODULE_ID) {
          // Fetch from local file system server
          response = await fileSystemService.fetchFilters(sectionId);
        } else {
          // Refresh auth token if necessary
          let token = auth?.accessToken;
          if (lookingGlassService.needsRefresh(auth?.expires, auth?.refreshToken)) {
            const authResponse = await lookingGlassService.refreshAuth(moduleId, auth.refreshToken);
            setAuth(moduleId, authResponse);
            token = authResponse.accessToken;
          }

          // Query for tags
          response = await lookingGlassService.fetchFilters(moduleId, sectionId, token);
        }

        response.sort((a, b) => a.name.localeCompare(b.name));
        setTags(moduleId, response);
        setTagSectionLoading(moduleId, sectionId, false);
      } catch (error) {
        console.error("ERROR fetching items", error);
      }
    }

    if (section.loading && !section.itemId) {
      fetchTagSectionItems();
    }
  }, [moduleId, sectionId]);

  const itemHeight = 48;
  const sectionCount = section.items.length;

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
