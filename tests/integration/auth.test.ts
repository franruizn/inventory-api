import { CreateUserDto } from "../../src/schemas/auth.schema";
import request from 'supertest';
import { clearDb, closeDb } from "../helpers/db.helper"
import app from "../../src/app";
import { waitForDb } from "../../src/config/db";

beforeAll(async () => {
    await waitForDb();
});

beforeEach(async () => {
    await clearDb();
})

afterAll(async () => {
    await closeDb();
})

const validUser: CreateUserDto = {
    email: 'mockemail@gmail.com',
    pass: 'MockPassword123'
}

const invalidLoginData: CreateUserDto = {
    email: 'mockemail@gmail.com',
    pass: 'InvalidPassword321'
}

const path = '/api/v1/auth';

test('should return 201 when a register is completed successfully', async () => {
    const created = await request(app).post(`${path}/register`).send(validUser);

    expect(created.status).toBe(201);
});

test('should return 409 when an email is duplicated', async () => {
    await request(app).post(`${path}/register`).send(validUser);
    const duplicated = await request(app).post(`${path}/register`).send(validUser);

    expect(duplicated.status).toBe(409);
});

test('should return 200 when logged in', async () => {
    await request(app).post(`${path}/register`).send(validUser);
    const logged = await request(app).post(`${path}/login`).send(validUser);

    expect(logged.status).toBe(200);
    expect(logged.body.data).toBeDefined();
});

test('should return 401 when credentials are not valid', async () => {
    await request(app).post(`${path}/register`).send(validUser);
    const invalidLog = await request(app).post(`${path}/login`).send(invalidLoginData);

    expect(invalidLog.status).toBe(401);
});
