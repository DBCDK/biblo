import profileParser from './../profile.parser';
import {chuck} from './../mocks/profile.parser.mock';
import {expect} from 'chai';

describe('Testing profileParser', () => {
  it('Should remove disallowed tags', () => {
    const chuckWithDisallowedTags = Object.assign({}, chuck, {displayName: '<script> document.getElementById("p2").style.color = "blue"; </script>Chuck Norris'});
    const result = profileParser(chuckWithDisallowedTags, true, 'small');
    expect(result.raw.description).to.equal('Chuck Norris ordered a Big Mac at Burger King, <b>and got one</b>');
    expect(result.raw.displayName).to.equal('Chuck Norris');
  });
});
