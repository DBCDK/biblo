/**
 * @file: General stuff used for testing
 */
import 'raf/polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

Enzyme.configure({adapter: new Adapter()});
global.sinon = sinon;
