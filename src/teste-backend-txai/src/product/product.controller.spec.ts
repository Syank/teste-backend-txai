import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Products', () => {
    let application: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        application = moduleFixture.createNestApplication();

        await application.init();
    });

    it("Create product", async () => {
        const token = await getDefaultAuthenticationToken(application);

        return request(application.getHttpServer())
            .post('/product/createProduct')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "name": "Produto teste",
                "price": 10,
                "quantity": 5
            })
            .expect(HttpStatus.CREATED).
            expect((response) => {
                expect(response.body).toMatchObject({
                    "name": "Produto teste",
                    "price": 10,
                    "quantity": 5
                });

                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBeGreaterThan(0);

            });

    });

    it("List products", async () => {
        const token = await getDefaultAuthenticationToken(application);
        const userId = await getUserId(application, token);

        return request(application.getHttpServer())
            .get('/product/findAll')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK).
            expect((response) => {
                const productsList = response.body;

                expect(productsList).toBeInstanceOf(Array);
                expect(productsList.length).toBeGreaterThan(0);

                for (let i = 0; i < productsList.length; i++) {
                    const product = productsList[i];

                    expect(product).toHaveProperty("userId");
                    expect(product.userId).toBe(userId);

                }

            });

    });

    it("Update product", async () => {
        const token = await getDefaultAuthenticationToken(application);
        const sampleProduct = await getSampleProduct(application, token);

        return request(application.getHttpServer())
            .put('/product/updateProduct')
            .set('Authorization', `Bearer ${token}`)
            .send({
                "id": sampleProduct.id,
                "name": "Produto teste alterado",
                "price": 20,
                "quantity": 10
            })
            .expect(HttpStatus.OK).
            expect((response) => {
                expect(response.body).toMatchObject({
                    "name": "Produto teste alterado",
                    "price": 20,
                    "quantity": 10
                });

            });

    });

    it("Delete product", async () => {
        const token = await getDefaultAuthenticationToken(application);
        const sampleProduct = await getSampleProduct(application, token);

        return request(application.getHttpServer())
            .delete('/product/deleteProduct?productId=' + sampleProduct.id)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK).
            expect((response) => {
                expect(response.body).toMatchObject({
                    "id": sampleProduct.id
                });
            });

    });

});

async function getSampleProduct(application: INestApplication, token: string) {
    const response = await request(application.getHttpServer())
        .get('/product/findAll')
        .set('Authorization', `Bearer ${token}`);

    return response.body[0];
}

async function getUserId(application: INestApplication, token: string) {
    const response = await request(application.getHttpServer())
        .get('/auth/userId')
        .set('Authorization', `Bearer ${token}`);

    return parseInt(response.text);
}

async function getDefaultAuthenticationToken(application: INestApplication) {
    const response = await request(application.getHttpServer())
        .post('/auth/login')
        .send({
            login: 'sistematxai',
            password: '123456789'
        });

    return response.text;
}