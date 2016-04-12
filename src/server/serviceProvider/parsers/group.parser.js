import parseProfile from './profile.parser';
import parseText from './text.parser';

export default function parseGroup(group) {
  group.owner = parseProfile(group.owner, true, 'small');
  group.image = group.coverImage && '/billede/' + group.coverImage.id + '/small' || null;
  group.raw = {
    name: group.name,
    description: group.description
  };
  group.name = parseText(group.name);
  group.description = parseText(group.description);
  return group;
}
