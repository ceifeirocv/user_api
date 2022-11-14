/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */

const httpMocks = require('node-mocks-http');

const {
  createUser, deleteUser, updateUser, getUser,
} = require('./UserController');

jest.mock('../models/User');

let req;
let res;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});
// get user info

// create user
describe('get user info', () => {
  it('it should be a method', () => {
    expect(typeof getUser).toBe('function');
  });
  it('should return User not found', async () => {
    req = {
      params: {
        id: '10',
      },
    };
    await getUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User not found, provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      params: {
        id: '1.0',
      },
    };
    await getUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      params: {
        id: '1a0',
      },
    };
    await getUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('should return User informations', async () => {
    req = {
      params: {
        id: '1',
      },
    };
    await getUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      id: 1,
      username: 'anyuser',
      email: 'any@mail.cv',
    });
  });
});

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
  it('should ask for an unused user', async () => {
    req = {
      body: {
        username: 'useduser',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'username in use, provide other' });
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
  it('should ask an unused email', async () => {
    req = {
      body: {
        username: 'anyuser',
        email: 'used@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'email in use, provide other' });
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
// Delete User
describe('delete user', () => {
  it('it should be a method', () => {
    expect(typeof deleteUser).toBe('function');
  });
  it('should return User not found', async () => {
    req = {
      body: {
        userId: 10,
      },
    };
    await deleteUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User not found, provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      body: {
        userId: '1.0',
      },
    };
    await deleteUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      body: {
        userId: '1a0',
      },
    };
    await deleteUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('should return deleted User', async () => {
    req = {
      body: {
        userId: 1,
      },
    };
    await deleteUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'User anyuser Deleted',
    });
  });
});

// update User
describe('update user', () => {
  it('it should be a method', () => {
    expect(typeof updateUser).toBe('function');
  });
  it('should return User not found', async () => {
    req = {
      body: {
        userId: '10',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'User not found, provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      body: {
        userId: '1.0',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('if id not integer should return id error', async () => {
    req = {
      body: {
        userId: '1a0',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Provide a valid Id' });
  });
  it('should ask to confirm password', async () => {
    req = {
      body: {
        userId: '1',
        password: '01234567',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" missing required peer \"confirm_password\"' });
  });
  it('should ask for a valid email (no domain)', async () => {
    req = {
      body: {
        userId: '1',
        email: 'any@mailcv',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" must be a valid email' });
  });
  it('should ask for a valid email (no @)', async () => {
    req = {
      body: {
        userId: '1',
        email: 'anymail.cv',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"email\" must be a valid email' });
  });
  it('should ask an unused email', async () => {
    req = {
      body: {
        userId: '1',
        email: 'used@mail.cv',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'email in use, provide other' });
  });
  it('should ask for a longer password', async () => {
    req = {
      body: {
        userId: '1',
        password: '0123456',
        confirm_password: '01234567',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ message: '\"password\" length must be at least 8 characters long' });
  });
  it('should return updated User (only email)', async () => {
    req = {
      body: {
        userId: '1',
        email: 'updated@mail.cv',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'User anyuser Updated',
    });
  });
  it('should return updated User (password only)', async () => {
    req = {
      body: {
        userId: '1',
        password: '012345678',
        confirm_password: '012345678',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'User anyuser Updated',
    });
  });
  it('should return updated User (password only)', async () => {
    req = {
      body: {
        userId: '1',
        email: 'updated@mail.cv',
        password: '012345678',
        confirm_password: '012345678',
      },
    };
    await updateUser(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: 'User anyuser Updated',
    });
  });
});

req = {
  body: {
    userId: '1',
    username: 'anyuser',
    email: 'any@mail.cv',
    password: '01234567',
    confirm_password: '01234567',
  },
};
