/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const httpMocks = require('node-mocks-http');

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
        username: 'any_user',
        email: 'any@mail.cv',
        password: '01234567',
        confirm_password: '01234567',
      },
    };
    await createUser(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toBe({ message: '\"username\" is required' });
  });
});
