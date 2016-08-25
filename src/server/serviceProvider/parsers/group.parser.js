import parseProfile from './profile.parser';
import parseText from './text.parser';

/**
 * Abstracts away common logic for groups shared across transforms.
 * @param {PlainObject}group
 * @returns {PlainObject}
 */
export default function parseGroup(group = {}) {
  group.owner = parseProfile(group.owner, true, 'small');
  group.image = group.coverImage && '/billede/' + group.coverImage.id + '/small' || null;
  group.imageSquare = group.coverImage && '/billede/' + group.coverImage.id + '/small-square' || null;
  group.raw = {
    name: group.name,
    description: group.description
  };
  group.name = parseText(group.name, false, 'none');
  group.description = parseText(group.description);
  group.isClosed = !!group.timeClosed || (Date.now() - Date.parse(group.timeClosed)) > 0;
  return group;
}
