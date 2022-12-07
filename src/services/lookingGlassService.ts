import type { Gallery as GalleryResponse } from "../store/gallery";
import type { Module as ModuleResponse } from "../store/module";
import type { Auth as AuthResponse } from "../store/auth";
import type { Tag as TagResponse } from "../store/tag";

const baseURL = "http://localhost:3001";

export function needsRefresh(expires?: string | Date, refreshToken?: string): boolean {
  // check if module supports refreshing
  if (!expires) {
    return false;
  }

  // compare current time with the expiration date
  return new Date() >= new Date(expires);
}

export async function fetchModules(): Promise<ModuleResponse[]> {
  const response = await fetch(baseURL);
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ModuleResponse[];
}

export async function fetchGallery(
  moduleId: string,
  accessToken?: string,
  galleryId?: string,
  offset?: number,
  after?: string,
  query?: string,
  sort?: string,
  filters?: string[]
): Promise<GalleryResponse> {
  const params = new URLSearchParams();
  if (galleryId) params.set("galleryId", galleryId);
  if (offset) params.set("offset", offset.toString());
  if (after) params.set("after", after);
  if (query) params.set("query", query);
  if (sort) params.set("sort", sort);
  if (filters) {
    filters.forEach((filter) => {
      params.append("filters", filter);
    });
  }

  const headers: Headers = new Headers();
  if (accessToken) headers.set("access-token", accessToken);

  const url = new URL(`/gallery/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as GalleryResponse;
}

export async function fetchFilters(moduleId: string, filter?: string, accessToken?: string): Promise<TagResponse[]> {
  const params = new URLSearchParams();
  if (filter) params.set("filter", filter);

  const headers: Headers = new Headers();
  if (accessToken) headers.set("access-token", accessToken);

  const url = new URL(`/filters/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TagResponse[];
}

export async function fetchItemFilters(moduleId: string, itemId: string, accessToken?: string): Promise<TagResponse[]> {
  const params = new URLSearchParams();
  params.set("itemId", itemId);

  const headers: Headers = new Headers();
  if (accessToken) headers.set("access-token", accessToken);

  const url = new URL(`/filters/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as TagResponse[];
}

export async function refreshAuth(moduleId: string, refreshToken: string): Promise<AuthResponse> {
  const url = new URL(`/refresh/${moduleId}`, baseURL);
  const headers = { "refresh-token": refreshToken };

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as AuthResponse;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}

export async function login(moduleId: string, username?: string, password?: string): Promise<AuthResponse> {
  const params = new URLSearchParams();
  if (username) params.set("username", username);
  if (password) params.set("password", password);

  const url = new URL(`/login/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as AuthResponse;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}

export async function authorize(moduleId: string, code: string): Promise<AuthResponse> {
  const params = new URLSearchParams([["code", code]]);
  const url = new URL(`/authorize/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as AuthResponse;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}
