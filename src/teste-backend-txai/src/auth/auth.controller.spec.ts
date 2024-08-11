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

});