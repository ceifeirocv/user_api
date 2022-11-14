/* eslint-disable no-useless-escape */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');

const { createSession } = require('./SessionController');

jest.mock('../models/User');

let req;
let res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

// create user
describe('create session', () => {
  it('it should be a method', () => {
    expect(typeof createSession).toBe('function');
  });
  it('should ask for email if not provided', async () => {
    req = {
      body: {
        password: '01234567',
      },
    };
    await createSession(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" is required' });
  });
  it('should ask for password if not provided', async () => {
    req = {
      body: {
        email: 'any@mail.cv',
      },
    };
    await createSession(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" is required' });
  });
  it('should return wrong email or password', async () => {
    req = {
      body: {
        email: 'wrong@mail.cv',
        password: '01234567',
      },
    };
    await createSession(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'wrong email or password' });
  });
  it('should return wrong email or password', async () => {
    req = {
      body: {
        email: 'used@mail.cv',
        password: '01234569',
      },
    };
    await createSession(req, res);
    expect(res.statusCode).toBe(401);
    expect(res._getJSONData()).toEqual({ message: 'wrong email or password' });
  });
  it('should return session created', async () => {
    req = {
      body: {
        email: 'used@mail.cv',
        password: '01234567',
      },
    };
    await createSession(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({
      name: 'anyuser',
      token: res._getJSONData().token,
    });
  });
});
