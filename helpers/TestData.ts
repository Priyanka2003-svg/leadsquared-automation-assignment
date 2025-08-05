import { UserData } from '../pages/WebTablesPage';

export class TestData {
  static getRandomUser(): UserData {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 999);
    
    return {
      firstName: `John${timestamp}`,
      lastName: `Doe${randomNum}`,
      email: `john.doe${timestamp}${randomNum}@test.com`,
      age: `${25 + Math.floor(Math.random() * 15)}`, // Age between 25-40
      salary: `${40000 + Math.floor(Math.random() * 60000)}`, // Salary between 40k-100k
      department: this.getRandomDepartment()
    };
  }

  static getUpdatedUser(): Partial<UserData> {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 999);
    
    return {
      firstName: `Jane${timestamp}`,
      lastName: `Smith${randomNum}`,
      salary: `${50000 + Math.floor(Math.random() * 50000)}`, // Updated salary
      department: this.getRandomDepartment()
    };
  }

  static getLoginCredentials() {
    // For DemoQA testing - these might work or might not, depending on the site
    const credentials = [
      { username: 'testuser', password: 'Test@123' },
      { username: 'demouser', password: 'Demo@123' },
      { username: 'user123', password: 'Password@123' }
    ];
    
    // Return a random credential set, or use environment variables if available
    return {
      username: process.env.USERNAME || credentials[0].username,
      password: process.env.PASSWORD || credentials[0].password
    };
  }

  static getMultipleUsers(count: number = 3): UserData[] {
    const users: UserData[] = [];
    
    for (let i = 0; i < count; i++) {
      const timestamp = Date.now().toString().slice(-6);
      const userNum = i + 1;
      
      users.push({
        firstName: `TestUser${userNum}${timestamp}`,
        lastName: `LastName${userNum}`,
        email: `testuser${userNum}.${timestamp}@example.com`,
        age: `${20 + userNum * 5}`,
        salary: `${30000 + userNum * 10000}`,
        department: this.getRandomDepartment()
      });
    }
    
    return users;
  }

  static getRandomDepartment(): string {
    const departments = [
      'Engineering',
      'Quality Assurance',
      'Marketing',
      'Sales',
      'Human Resources',
      'Finance',
      'Operations',
      'Customer Support'
    ];
    
    return departments[Math.floor(Math.random() * departments.length)];
  }

  static getTestUserForSearch(): UserData {
    // Create a user specifically designed for search testing
    return {
      firstName: 'SearchTest',
      lastName: 'User',
      email: 'search.test@example.com',
      age: '30',
      salary: '55000',
      department: 'Testing'
    };
  }

  static getSpecialCharacterUser(): UserData {
    const timestamp = Date.now().toString().slice(-4);
    
    return {
      firstName: `O'Connor${timestamp}`,
      lastName: `Smith-Jones`,
      email: `o.connor.smith+test${timestamp}@example.com`,
      age: '28',
      salary: '45000',
      department: 'R&D'
    };
  }

  static getValidationTestData() {
    return {
      emptyUser: {
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        salary: '',
        department: ''
      },
      invalidEmailUser: {
        firstName: 'Invalid',
        lastName: 'Email',
        email: 'not-an-email',
        age: '25',
        salary: '50000',
        department: 'Testing'
      },
      invalidAgeUser: {
        firstName: 'Invalid',
        lastName: 'Age',
        email: 'invalid.age@test.com',
        age: 'not-a-number',
        salary: '50000',
        department: 'Testing'
      }
    };
  }

  static getEnvironmentConfig() {
    return {
      baseUrl: process.env.BASE_URL || 'https://demoqa.com',
      timeout: parseInt(process.env.TIMEOUT || '30000'),
      retries: parseInt(process.env.RETRIES || '1'),
      headless: process.env.HEADLESS === 'true',
      slowMo: parseInt(process.env.SLOW_MO || '0')
    };
  }
}