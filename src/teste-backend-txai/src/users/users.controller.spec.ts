import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Authentication', () => {
    let application: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        application = moduleFixture.createNestApplication();

        await application.init();
    });

    it("Successfull authentication with valid credentials", () => {
        return request(application.getHttpServer())
            .post('/auth/login')
            .send({
                login: 'sistematxai',
                password: '123456789'
            })
            .expect(HttpStatus.OK).
            expect((response) => {
                expect(response.text).toBeTruthy();
            });
    });

    it("Unsuccessfull authentication with invalid credentials", () => {
        return request(application.getHttpServer())
            .post('/auth/login')
            .send({
                login: 'no_user',
                password: 'no_password'
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it("List all users", async () => {
        const token = await getAdminAuthenticationToken(application);

        return request(application.getHttpServer())
            .get('/users/findAll')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.OK).
            expect((response) => {
                const usersList = response.body;

                expect(usersList).toBeInstanceOf(Array);
                expect(usersList.length).toBeGreaterThan(0);

                for (let i = 0; i < usersList.length; i++) {
                    const user = usersList[i];

                    expect(user).toHaveProperty('id');
                    expect(user).toHaveProperty('login');
                    expect(user).toHaveProperty('password');

                }

            });

    });

    it("Update user", async () => {
        const token = await getAdminAuthenticationToken(application);
        const testUser = await createTestUser(application, token);

        return request(application.getHttpServer())
            .put('/users/updateUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: testUser.body.id,
                name: "Test User Updated",
            })
            .expect(HttpStatus.OK).
            expect(async (response) => {
                expect(response.body).toMatchObject({
                    id: testUser.body.id,
                    name: "Test User Updated",
                    login: testUser.body.login,
                    role: testUser.body.role,
                    password: testUser.body.password
                });

                await deleteTestUser(application, token, testUser.body.id);
            });
    });

    it("Create user", async () => {
        const token = await getAdminAuthenticationToken(application);

        return request(application.getHttpServer())
            .post('/users/registerUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Test User",
                login: "testUser",
                password: "testUser",
                role: "USER"
            })
            .expect(HttpStatus.CREATED).
            expect(async (response) => {
                expect(response.body).toMatchObject({
                    name: "Test User",
                    login: "testUser",
                    role: "USER",
                    password: "testUser"
                });

                expect(response.body).toHaveProperty('id');
                expect(response.body.id).toBeGreaterThan(0);

                await deleteTestUser(application, token, response.body.id);

            });

    });

    it("Delete user", async () => {
        const token = await getAdminAuthenticationToken(application);
        const testUser = await createTestUser(application, token);

        return request(application.getHttpServer())
            .delete('/users/deleteUser')
            .set('Authorization', `Bearer ${token}`)
            .query({
                userId: testUser.body.id
            })
            .expect(HttpStatus.OK).
            expect((response) => {
                expect(response.body).toMatchObject({
                    id: testUser.body.id
                });
            });
    });

    it("Try to delete user without being an admin", async () => {
        const token = await getNotAdminAuthenticationToken(application);
        const testUser = await createTestUser(application, token);

        return request(application.getHttpServer())
            .delete('/users/deleteUser')
            .set('Authorization', `Bearer ${token}`)
            .query({
                userId: testUser.body.id
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it("Try to create user without being an admin", async () => {
        const token = await getNotAdminAuthenticationToken(application);

        return request(application.getHttpServer())
            .post('/users/registerUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "Test User",
                login: "testUser",
                password: "testUser",
                role: "USER"
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it("Try to update user without being an admin", async () => {
        const token = await getNotAdminAuthenticationToken(application);
        const testUser = await createTestUser(application, token);

        return request(application.getHttpServer())
            .put('/users/updateUser')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: testUser.body.id,
                name: "Test User Updated",
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it("Try to list all users without being an admin", async () => {
        const token = await getNotAdminAuthenticationToken(application);

        return request(application.getHttpServer())
            .get('/users/findAll')
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.UNAUTHORIZED);
    });

});

async function deleteTestUser(application: INestApplication, token: string, userId: number) {
    return request(application.getHttpServer())
        .delete('/users/deleteUser')
        .set('Authorization', `Bearer ${token}`)
        .query({
            userId: userId
        });
}

async function createTestUser(application: INestApplication, token: string) {
    return request(application.getHttpServer())
        .post('/users/registerUser')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: "Test User",
            login: "testUser",
            password: "testUser",
            role: "USER"
        });
}

async function getNotAdminAuthenticationToken(application: INestApplication) {
    const response = await request(application.getHttpServer())
        .post('/auth/login')
        .send({
            login: 'user',
            password: '123456789'
        });

    return response.text;
}

async function getAdminAuthenticationToken(application: INestApplication) {
    const response = await request(application.getHttpServer())
        .post('/auth/login')
        .send({
            login: 'sistematxai',
            password: '123456789'
        });

    return response.text;
}