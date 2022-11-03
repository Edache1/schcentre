const users = require('../../../controllers/users');
const db = require('../../../helpers/modules');


const validateProfilePhoto = function(profileImage){
	const validImageExtentions = ["image/jpeg", "image/png", "image/jpg"];
	if (!profileImage) throw new Error("Profile Image is required");
	if (!validImageExtentions.includes(profileImage.mimetype)) throw new Error("Invalid image format");
	if (profileImage.size > 10) throw new Error("Maximum file size is 10Mb");
	return profileImage;
}

const diversityGrade = function(userObject) {
	//const loanTypes = ['Home Loan', 'Heloc', 'Credit Card', 'Car Loan'];
	if (userObject.loanTypeCount = 1 && userObject.totalAccount > 0 && userObject.totalAccount <= 4) {
		return "D";
	} else if (userObject.loanTypeCount = 2 && userObject.totalAccount >= 5 && userObject.totalAccount <= 10) {
		return "C";
	} else if (userObject.loanTypeCount = 3 && userObject.totalAccount > 10 && userObject.totalAccount <= 20) {
		return "B";
	} else if (userObject.loanTypeCount >= 4 || userObject.totalAccount > 20) {
		return "A";
	} else {
		return null;
	}
}

describe('Account Diversity Grade', () => {
	const userObjectFunction = function() { return {totalAccount: 0, loanTypeCount: 0}};

	it('should return grade "A" if total accounts is > 20 or loan type count is >= 4', () => {
		let userObject = userObjectFunction();
		//Total accounts greater than 20
		userObject.totalAccount = 21;
		expect(diversityGrade(userObject)).toBe('A');
		//Loan type count greater than or equals to 4
		userObject.loanTypeCount = 4;
		expect(diversityGrade(userObject)).toBe('A');
	});

	it('should return grade "B" if total accounts > 10 or loan type count = 3', () => {
		let userObject = userObjectFunction();
		//Total accounts greater than 10
		userObject.totalAccount = 11;
		expect(diversityGrade(userObject)).toBe('B');
		//Loan type count equals to 3
		userObject.loanTypeCount = 3;
		expect(diversityGrade(userObject)).toBe('B');		
	});

	it('should return grade "C" if total accounts >= 5 or loan type count = 2', () => {
		let userObject = userObjectFunction();
		//Total accounts greater than or equals to 5
		userObject.totalAccount = 5;
		expect(diversityGrade(userObject)).toBe('C');
		//Loan type count equals to 2
		userObject.loanTypeCount = 2;
		expect(diversityGrade(userObject)).toBe('C');		
	});

	it('should return grade "D" if total accounts > 0 or loan type count = 1', () => {
		let userObject = userObjectFunction();
		//Total accounts greater than 0
		userObject.totalAccount = 1;
		expect(diversityGrade(userObject)).toBe('D');
		//Loan type count equals to 1
		userObject.loanTypeCount = 1;
		expect(diversityGrade(userObject)).toBe('D');		
	});
});

describe('test suite to determine if the profile photo function is working as expected', () => {

	it('should throw error if no file is selected or image input is falsy', () => {
		const args = [null, undefined, NaN, '', 0, false];
		args.forEach((arg => expect(() => { validateProfilePhoto(arg) }).toThrow()));		
	});

	it('should throw error if an invalid file type is selected', () => {
		const arg = {image: 'profile_picture.pdf', mimetype: 'pdf'};
		expect(() => {validateProfilePhoto(arg)}).toThrow();		
	});

	it('should throw error if file size is greater than 10mb', () => {
		const arg = {size: 11};
		expect(() => {validateProfilePhoto(arg)}).toThrow();		
	});

	it('should return a valid profile image object', () => {
		const arg = {image: 'profile_picture.png', mimetype: 'image/png', size: 9};
		expect(validateProfilePhoto(arg)).toMatchObject(arg);		
	});
});

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