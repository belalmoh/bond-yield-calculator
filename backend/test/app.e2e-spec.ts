import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/api/bond/calculate (POST)', () => {
		return request(app.getHttpServer())
			.post('/api/bond/calculate')
			.send({
				faceValue: 1000,
				couponRate: 5,
				marketPrice: 950,
				yearsToMaturity: 10,
				frequency: 'semi-annual',
			})
			.expect(201)
			.expect((res) => {
				expect(res.body.status).toBe('discount');
				expect(res.body.cashFlows.length).toBe(20);
			});
	});
});
