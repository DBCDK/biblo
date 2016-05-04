/**
 * Constants to keep track of all the hyperlinks in the app.
 * This makes changing URLs a lot easier.
 *
 * Follow this format:
 * export const YOUR_PAGE_LINK = '/link/to/your/page';
 */

// Links for groups
export const CREATE_GROUP_LINK = '/grupper/opret';
export const GROUP_OVERVIEW = '/grupper';

// Links for profile
export const PUBLIC_PROFILE = '/profil';
export const PROFILE_EDIT = '/profil/rediger';
export const MODERATOR_PROFILE_EDIT = (id) => {
  return '/profil/rediger/moderator/' + id;
};

// Links to static pages
export const DET_SKER_PAGE = '/';
export const OM_BIBLIO_PAGE = '/indhold/om-biblo';
export const SOS = '/indhold/spoergsmaal-og-svar';
export const SIKKERHED_PAA_BIBLO = '/indhold/sikkerhed-paa-biblo';
export const CONTACT = '/indhold/kontakt';

// Links for order
export const ORDER_POST_URL = '/materiale/bestil';
