// test/userController.test.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Assuming your main Express app file is 'app.js'
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Controller', () => {
  // Test user creation
  it('should create a new user', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/create-user')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        strength: ['Coding', 'Problem Solving', 'Teamwork'],
        about: 'I am a software developer.',
        password: 'password123',
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('message').equal('User created successfully');
    // Add more assertions as needed
  });

  // Test user retrieval
  it('should get all users', async () => {
    const res = await chai.request(app).get('/api/users/get-all-users');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    // Add more assertions as needed
  });

  // Test user update
  it('should update a user', async () => {
    const res = await chai
      .request(app)
      .put('/api/users/update-user/:userId')
      .send({
        name: 'Updated Name',
        // Add other fields to update
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').equal('User updated successfully');
    // Add more assertions as needed
  });

  // Test user deletion
  it('should delete a user', async () => {
    const res = await chai.request(app).delete('/api/users/delete-user/:userId');

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message').equal('User deleted successfully');
    // Add more assertions as needed
  });
});
