import * as fileSystemApi from './fileSystemApi';
import { fileSystemModuleId } from './store/modules';
import type { Auth, Filter, Gallery, Module } from './types';

const baseURL = 'http://localhost:3001';

/**
 * Determines if an accessToken needs to be refreshed
 */
export function needsRefresh(expires?: string | Date): boolean {
  // check if module supports refreshing
  if (!expires) {
    return false;
  }

  // compare current time with the expiration date
  return new Date() >= new Date(expires);
}

/**
 * Fetches all modules
 */
export async function fetchModules(): Promise<Module[]> {
  const response = await fetch(baseURL);
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Module[];
}

/**
 * Fetches posts
 */
export async function fetchGallery(
  moduleId: string,
  accessToken?: string,
  galleryId?: string,
  offset?: number,
  after?: string,
  query?: string,
  sort?: string,
  filters?: string[]
): Promise<Gallery> {
  if (moduleId === fileSystemModuleId) {
    return await fileSystemApi.fetchGallery(galleryId, offset, sort, filters);
  }

  const params = new URLSearchParams();
  if (galleryId) params.set('galleryId', galleryId);
  if (offset) params.set('offset', offset.toString());
  if (after) params.set('after', after);
  if (query) params.set('query', query);
  if (sort) params.set('sort', sort);
  if (filters) {
    filters.forEach((filter) => {
      params.append('filters', filter);
    });
  }

  const headers: Headers = new Headers();
  if (accessToken) headers.set('access-token', accessToken);

  const url = new URL(`/gallery/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Gallery;
}

/**
 * Fetches filters for a specific filter section
 */
export async function fetchFilters(moduleId: string, filterSectionId: string, accessToken?: string): Promise<Filter[]> {
  if (moduleId === fileSystemModuleId) {
    return await fileSystemApi.fetchFilters(filterSectionId);
  }

  const params = new URLSearchParams();
  params.set('filter', filterSectionId);

  const headers: Headers = new Headers();
  if (accessToken) headers.set('access-token', accessToken);

  const url = new URL(`/filters/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Filter[];
}

/**
 * Fetches filters for a specific item
 */
export async function fetchItemFilters(moduleId: string, itemId: string, accessToken?: string): Promise<Filter[]> {
  if (moduleId === fileSystemModuleId) {
    throw new Error('Not implemented');
  }

  const params = new URLSearchParams();
  params.set('itemId', itemId);

  const headers: Headers = new Headers();
  if (accessToken) headers.set('access-token', accessToken);

  const url = new URL(`/filters/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as Filter[];
}

/**
 * Refreshes accessToken using refreshToken
 */
export async function refreshAuth(moduleId: string, refreshToken: string): Promise<Auth> {
  if (moduleId === fileSystemModuleId) {
    throw new Error('Not implemented');
  }

  const url = new URL(`/refresh/${moduleId}`, baseURL);
  const headers = { 'refresh-token': refreshToken };

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as Auth;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}

/**
 * Basic login with username and password
 */
export async function login(moduleId: string, username?: string, password?: string): Promise<Auth> {
  if (moduleId === fileSystemModuleId) {
    throw new Error('Not implemented');
  }

  const params = new URLSearchParams();
  if (username) params.set('username', username);
  if (password) params.set('password', password);

  const url = new URL(`/login/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as Auth;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}

/**
 * Authorizes an Oauth2 code in exchange for an access token
 */
export async function authorize(moduleId: string, code: string): Promise<Auth> {
  if (moduleId === fileSystemModuleId) {
    throw new Error('Not implemented');
  }

  const params = new URLSearchParams([['code', code]]);
  const url = new URL(`/authorize/${moduleId}?${params.toString()}`, baseURL);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status} ${response.statusText}`);
  }

  const authResponse = (await response.json()) as Auth;
  authResponse.expires = new Date(new Date().getTime() + authResponse.expiresIn * 1000);
  return authResponse;
}
