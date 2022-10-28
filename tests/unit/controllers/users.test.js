const users = require('../../../controllers/users');
const db = require('../../../helpers/modules');




//Best way to implement mock functions
describe('notifyCustomer', () => {
	it('should send an email to customer', () => {
		const order = {userId: 1};
		db.getUser = jest.fn().mockReturnValue({email: 'a'});
		db.mail = jest.fn();
		users.notifyCustomer(order);
		expect(db.mail).toHaveBeenCalled();
		expect(db.mail.mock.calls[0][0]).toBe('a');
		expect(db.mail.mock.calls[0][1]).toMatch(/order/);
		/*const mockFunction = jest.fn();
		 mockFunction.mockReturnValue(1);
		 mockFunction.mockResolvedValue(1); returns a resolved promise with value 1
		 mockFunction.mockRejectedValue(new Error('with message')); returns a rejected promise
		const mockFunction = jest.fn().mockReturnValue({email: 'a'});
		expect(mail).toHaveBeenCalled();
		expect(mail.mock.calls[0][0]).toBe('a');
		expect(mail.mock.calls[0][1]).toMatch(/order/);
		expect(mail).toHaveBeenCalledWith('a', 'the message'); good for testing strings*/
	});
});

//mock function
describe('notifyCustomer', () => {
	it('should send an email to customer', () => {
		const order = {userId: 1};
		//re-assign the functions that talk to external resource
		db.getUser = function(userId) { 
			return {email: 'a'};
		}
		let mailSent = false;
		//re-assign the functions that talk to external resource
		db.mail = function(email, message) { 
			mailSent = true;
		}
		users.notifyCustomer(order);
		expect(mailSent).toBe(true);
	});
});

//mock function
describe('applyDiscount', () => {
	it('should apply 10% discount if customer have more than 10 points', () => {
		//reset the functions that talk to external resource
		db.getUser = function(userId) { 
			console.log('Fake Reading Customer');
			return {id: userId, points: 20};
		}
		const order = {userId: 1, totalPrice: 10};
		users.applyDiscount(order);
		expect(order.totalPrice).toBe(9);
	});
});

//test Exceptions
describe('registerUser', () => {
	it('should throw if username is falsy', () => {
		const args = [null, undefined, NaN, '', 0, false];
		args.forEach((arg => expect(() => { users.registerUser(arg) }).toThrow()));	
	});
	it('should return a user Object if valid username is passed', () => {
		const result = users.registerUser('Edace');
		expect(result).toMatchObject({username: 'Edace'});
		expect(result.id).toBeGreaterThan(0);
	});
});

//test objects
describe('getProduct', () => {
	it('should return the product with the given id', () => {
		const result = users.getProduct(2);
		expect(result).toEqual({id: 2, price: 10});
		expect(result).toHaveProperty('id', 2); // '2' this '2' is read as a string and will break the test
		//use toMatchObject when the object has many properties
		expect(result).toMatchObject({id: 2, price: 10});
	});
});

//test arrays
describe('getCurrencies', () => {
	it('should return supported currencies', () => {
		const result = users.getCurrencies();
		expect(result).toEqual(expect.arrayContaining(["EUR", "USD", "AUD"]));
	});
});

//test strings
describe('greet', () => {
	it('should return the greeting message', () => {
		const result = users.greet('Edace');
		expect(result).toMatch(/Edace/);
		expect(result).toContain("Edace");
	});
});

//test numbers
describe('absolute', () => { //describe() groups the tests, we can also replace "test()" with "it()"
	test('should return a positive number if input is positive', () => {
		const result = users.absolute(1);
		expect(result).toBe(1);
	});

	it('should return a positive number if input is negative', () => {
		const result = users.absolute(-1);
		expect(result).toBe(1);
	});

	it('should return 0 if input is 0', () => {
		const result = users.absolute(0);
		expect(result).toBe(0);
	});
});