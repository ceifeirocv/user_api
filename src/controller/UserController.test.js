/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');

const { createUser } = require('./UserController');

jest.mock('../models/User');

let req;
let res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

// create user
describe('create user', () => {
  it('it should be a method', () => {
    expect(typeof createUser).toBe('function');
  });
  it('should ask for user if not provided', async () => {
    req = {
      body: {
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"username\" is required' });
  });
  it('should ask for email if not provided', async () => {
    req = {
      body: {
        username: 'anyuser',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" is required' });
  });
  it('should ask for password if not provided', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'any@mail.cv',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" is required' });
  });
  it('should ask to confirm password', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'any@mail.cv',
        password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" missing required peer \"confirm_password\"' });
  });
  it('should ask for longer username', async () => {
    req = {
      body: {
        username: 'any',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"username\" length must be at least 5 characters long' });
  });
  it('should ask for longer username (space does not count)', async () => {
    req = {
      body: {
        username: '   any   ',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"username\" length must be at least 5 characters long' });
  });
  it('should ask for shorter username', async () => {
    req = {
      body: {
        username: 'anyuseradjhaoeiholajdehaklskd',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"username\" length must be less than or equal to 25 characters long' });
  });
  it('should ask alphanumeric username', async () => {
    req = {
      body: {
        username: 'any_user',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"username\" must only contain alpha-numeric characters' });
  });
  it('should ask for a valid email (no domain)', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'any@mailcv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" must be a valid email' });
  });
  it('should ask for a valid email (no @)', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'anymail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" must be a valid email' });
  });
  it('should ask for a longer password', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'any@mail.cv',
        password: '0123456',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" length must be at least 8 characters long' });
  });
  it('should return user created', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual({ message: 'User anyuser Created' });
  });
});

// req = {
//   body: {
//     username: 'anyuser',
//     email: 'any@mail.cv',
//     password: '01234567',
//     confirm_password: '01234567',
//   },
// };
