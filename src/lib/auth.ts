export interface User {
  email: string;
  password: string;
  fullName?: string;
  accountType?: 'buyer' | 'seller';
}

const mockDatabase: User[] = [
  {
    email: "test@example.com",
    password: "password123",
    fullName: "Test User",
    accountType: "buyer",
  },
];

export function mockAuth(email: string, password: string): boolean {
  // Mock authentication logic
  return mockDatabase.some(
    (user) => user.email === email && user.password === password
  );
}

export function mockSignUp(newUser: User): boolean {
  // Check if the user already exists
  const userExists = mockDatabase.some((user) => user.email === newUser.email);

  if (userExists) {
    return false; // User already exists
  }

  // Add the new user to the mock database
  mockDatabase.push(newUser);
  return true;
}