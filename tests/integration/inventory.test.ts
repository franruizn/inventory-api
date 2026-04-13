import { CreateItemDto } from "../../src/schemas/inventory.schema";
import request from 'supertest';
import { clearDb, closeDb } from "../helpers/db.helper"
import app from "../../src/app";
import { waitForDb } from "../../src/config/db";

let token: string;

const getAuthToken = async (): Promise<string> => {
    await request(app).post('/api/v1/auth/register').send({
        email: 'test@test.com',
        password: 'TestPassword123',
    });
    const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@test.com',
        password: 'TestPassword123',
    });
    return res.body.data.token;
};

beforeAll(async () => {
    await waitForDb();
});

beforeEach(async () => {
    await clearDb();
    token = await getAuthToken();
})

afterAll(async () => {
    await closeDb();
})

const validItem: CreateItemDto = {
    'name': "dress",
    'sku': "ABC-123",
    'quantity': 1,
    'price': 40,
    'category': "clothing",
    'description': "pink dress",
}

const path = '/api/v1/inventory'

test('should return 201 when creating succesfully', async () => {
    const created = await request(app).post(path).set('Authorization', `Bearer ${token}`).send(validItem);

    expect(created.status).toBe(201);
});

test('should return 409 when creating an existing SKU', async () => {
    await request(app).post(path).set('Authorization', `Bearer ${token}`).send(validItem);
    const duplicated = await request(app).post(path).set('Authorization', `Bearer ${token}`).send(validItem);

    expect(duplicated.status).toBe(409);
});

test('should return 404 when recovering a deleted item', async () => {
    const created = await request(app).post(path).set('Authorization', `Bearer ${token}`).send(validItem);
    const deleted = await request(app).set('Authorization', `Bearer ${token}`).delete(`${path}/${created.body.data.id}`);

    expect(deleted.status).toBe(204);

    const finalRes = await request(app).set('Authorization', `Bearer ${token}`).get(`${path}/${created.body.data.id}`);

    expect(finalRes.status).toBe(404);
})

test('should return 400 when SKU format is not correct', async () => {
    const res = await request(app).post(path).set('Authorization', `Bearer ${token}`).send({
        name: 'Dress',
        sku: 'abc-312',
        quantity: 1,
        price: 40,
        category: 'clothing',
    });

    expect(res.status).toBe(400);
});

test('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/v1/inventory');
    expect(res.status).toBe(401);
});

test('should return 401 when token is invalid', async () => {
    const res = await request(app)
        .get('/api/v1/inventory')
        .set('Authorization', 'Bearer InvalidToken');
    expect(res.status).toBe(401);
});