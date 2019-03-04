import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import moxios from "moxios"
import sinon from "sinon";

configure({ adapter: new Adapter() });
global.mount = mount;
global.shallow = shallow;
global.moxios = moxios;
global.sinon = sinon
