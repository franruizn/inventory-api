import { CreateItemDto } from "../../src/schemas/inventory.schema";
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

const validItem: CreateItemDto = {
    'name': "dress",
    'sku': "ABC-123",
    'quantity': 1,
    'price': 40,
    'category': "clothing",
    'description': "pink dress",
}

const path = '/api/v1/inventory'

test('should return 409 when creating an existing SKU', async () => {
    const created = await request(app).post(path).send(validItem);

    expect(created.status).toBe(201);

    const invalidPost = await request(app).post(path).send(validItem);

    expect(invalidPost.status).toBe(409);
});

test('should return 404 when recovering a deleted item', async () => {
    const created = await request(app).post(path).send(validItem);

    expect(created.status).toBe(201);

    const deleted = await request(app).delete(`${path}/${created.body.data.id}`);

    expect(deleted.status).toBe(204);

    const finalRes = await request(app).get(`${path}/${created.body.data.id}`);

    expect(finalRes.status).toBe(404);
})

test('should return 400 when SKU format is not correct', async () => {
    const res = await request(app).post(path).send({
        name: 'Dress',
        sku: 'abc-312',
        quantity: 1,
        price: 40,
        category: 'clothing',
    });

    expect(res.status).toBe(400);
})