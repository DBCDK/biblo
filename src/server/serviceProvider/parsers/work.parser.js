/**
 * @file
 * Adapt work attributes for use with biblo.dk
 */
function useCreateAutIfPossible(work) {
  if (work.creatorAut) {
    work.creator = work.creatorAut[0];
  }
  else {
    work.creator = (work.creator) ? work.creator[0] : '';
  }
  return work;
}

function getTags(work) {
  let tags = [];
  tags = (work.subjectDBCF) ? tags.concat(work.subjectDBCF) : tags;
  tags = (work.subjectDBCS) ? tags.concat(work.subjectDBCS) : tags;
  tags = (work.subjectDBCO) ? tags.concat(work.subjectDBCO) : tags;
  tags = (work.subjectDBCM) ? tags.concat(work.subjectDBCM) : tags;
  return tags;
}

/**
 * Change ereolen.dk til ereolengo.dk.
 *
 * @param onlineAccess
 * @returns {*}
 */
function parseOnlineAccess (onlineAccess) {
  if (typeof onlineAccess === 'string') {
    return onlineAccess.replace('ereolen.dk', 'ereolengo.dk');
  }
  else if (typeof onlineAccess === 'object') {
    return onlineAccess.map(element => element.replace('ereolen.dk', 'ereolengo.dk'));
  }

  return null;
}

export default function parseWork(work) {
  work.dcTitle = work.dcTitle ? work.dcTitle[0] : '';
  work.dcTitleFull = work.dcTitleFull ? work.dcTitleFull[0] : '';
  work.titleSeries = work.titleSeries ? work.titleSeries[0] : '';
  work.descriptionSeries = work.descriptionSeries ? work.descriptionSeries[0] : '';
  work.abstract = (work.abstract) ? work.abstract[0] : '';
  work = useCreateAutIfPossible(work);
  work.workType = (work.workType) ? work.workType[0] : 'other';
  work.coverUrl = (work.coverUrlFull) ? 'https:' + work.coverUrlFull[0] : '/images/covers/' + work.workType + '.png';
  work.extent = (work.extent) ? work.extent[0] : '';
  work.hasOnlineAccess = parseOnlineAccess(work.hasOnlineAccess);
  work.tags = getTags(work);
  work.subjectDK5 = (work.subjectDK5) ? work.subjectDK5[0] : '';
  work.subjectDK5Text = (work.subjectDK5Text) ? work.subjectDK5Text[0] : '';
  work.director = (work.creatorDrt) ? work.creatorDrt[0] : null;
  work.actors = (work.contributorAct) ? work.contributorAct : null;
  work.publisher = (work.publisher) ? work.publisher[0] : null;
  work.ageRecommended = (work.audienceAge) ? work.audienceAge : null;
  work.ageAllowed = (work.audienceMedieraad) ? work.audienceMedieraad[0] : null;

  return work;
}
