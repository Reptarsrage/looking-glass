import type { Gallery as GalleryResponse } from "../store/gallery";
import type { Tag as TagResponse } from "../store/tag";

const host = "http://localhost";

function getBaseUrl(): string {
  const search = new URLSearchParams(window.location.search);
  const port = search.get("port");
  return `${host}:${port}`;
}

export async function fetchGallery(
  galleryId?: string,
  offset?: number,
  sort?: string,
  filters?: string[]
): Promise<GalleryResponse> {
  const params = new URLSearchParams();
  if (galleryId) params.set("galleryId", galleryId);
  if (offset) params.set("offset", offset.toString());
  if (sort) params.set("sort", sort);
  if (filters) {
    filters.forEach((filter) => {
      params.append("filters", filter);
    });
  }

  const url = new URL(`/gallery?${params.toString()}`, getBaseUrl());
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as GalleryResponse;
}

export async function fetchFilters(filter?: string): Promise<TagResponse[]> {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);

  const url = new URL(`/filters?${params.toString()}`, getBaseUrl());
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TagResponse[];
}
