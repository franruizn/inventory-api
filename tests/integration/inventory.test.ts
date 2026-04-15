import { CreateItemDto } from "../../src/schemas/inventory.schema";
import request from 'supertest';
import { clearDb, closeDb } from "../helpers/db.helper"
import app from "../../src/app";
import { waitForDb } from "../../src/config/db";

let token: string;

const getAuthToken = async (): Promise<string> => {
    await request(app).post('/api/v1/auth/register').send({
        email: 'test@test.com',
        pass: 'TestPassword123',
    });
    const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@test.com',
        pass: 'TestPassword123',
    });
    return res.body.data;
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
    const created = await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);

    expect(created.status).toBe(201);
});

test('should return 409 when creating an existing SKU', async () => {
    await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);
    const duplicated = await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);

    expect(duplicated.status).toBe(409);
});

test('should return 404 when recovering a deleted item', async () => {
    const created = await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);

    console.log(created.body)

    const deleted = await request(app).delete(`${path}/${created.body.data.id}`).set('Authorization', `Bearer ${token}`);

    expect(deleted.status).toBe(204);

    const finalRes = await request(app).get(`${path}/${created.body.data.id}`).set('Authorization', `Bearer ${token}`);

    expect(finalRes.status).toBe(404);
})

test('should return 400 when SKU format is not correct', async () => {
    const res = await request(app).post(path).send({
        name: 'Dress',
        sku: 'abc-312',
        quantity: 1,
        price: 40,
        category: 'clothing',
    }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
});

test('should return 401 when no token is provided', async () => {
    const res = await request(app).get('/api/v1/inventory');
    expect(res.status).toBe(401);
});

test('should return 401 when token is invalid', async () => {
    const res = await request(app).get('/api/v1/inventory').set('Authorization', 'Bearer InvalidToken');
    expect(res.status).toBe(401);
});

test('should return 200 when updating an item', async () => {
    const created = await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);
    const res = await request(app).put(`${path}/${created.body.data.id}`).send({ 
        quantity: 99, 
        price: 199.99 
    }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(99);
});

test('should return 200 with pagination', async () => {
    await request(app).post(path).send(validItem).set('Authorization', `Bearer ${token}`);
    const res = await request(app).get(`${path}?page=1&limit=5`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pagination).toBeDefined();
    expect(res.body.data.pagination.page).toBe(1);
});