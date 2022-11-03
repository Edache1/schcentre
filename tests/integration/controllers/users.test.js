const request = require('supertest');
const {obtenirUsers, addMultipleUsers, deleteUser} = require('../../../helpers/users');

let server;

describe('/api/users', () => {
	beforeEach(() => {server = require('../../../bin/www')});
	afterEach(async () => {
		await server.close();
		await deleteUser();
	});

	describe('GET /', () => {
		it('should return all users', async () => {
			const usersArrayObject = [
				{firstName: 'edache1', lastName: 'ebute1'},
				{firstName: 'edache2', lastName: 'ebute2'}
			];
			await addMultipleUsers(usersArrayObject);

			const response = await request(server).get('/users');
			expect(response.status).toBe(200);
			expect(response.body.some(user => user.firstName == 'edache1')).toBeTruthy();
			expect(response.body.some(user => user.firstName == 'edache2')).toBeTruthy();
		});
	});
	describe('GET /:params', () => {
		it('should return user if valid param is passed', async () => {
			const dummyUserObj = {firstName: 'edache3', lastName: 'ebute3'};
			let userArryObj = await addMultipleUsers([dummyUserObj]);
			const userid = userArryObj[0].dataValues.userid;
			const response = await request(server).get('/users/'+userid);
			expect(response.status).toBe(200);
			
			expect(Object.keys(response.body)).toEqual(expect.arrayContaining(['firstName', 'lastName']));

			expect(response.body).toHaveProperty('firstName', 'edache3');
			expect(response.body).toHaveProperty('lastName', 'ebute3');
			//expect(response.body).toMatchObject(dummyUserObj);


		});
	});
	describe('GET /:params', () => {
		it('should return 404 if invalid params is passed', async () => {
			const userid = 1;
			const response = await request(server).get('/users/'+userid);
			expect(response.status).toBe(404);
		});
	});

});