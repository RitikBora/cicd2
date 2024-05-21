import { app } from "..";
import supertest from 'supertest';
import {describe , it , expect , vi} from 'vitest'
import { prismaClient } from "../__mocks__/connect";


vi.mock("../connect");



describe("Http sum request" , () =>
{
    it("Adding 2 and 3" , async () =>
    {

        prismaClient.sum.create.mockResolvedValue({
            id : 1 ,
            a : 2,
            b : 3,
            result : 5
        })

        vi.spyOn(prismaClient.sum, "create");


        const response = await supertest(app).post("/sum").send({a : 2 , b : 3});
        const answer = response.body.answer;

        expect(prismaClient.sum.create).toBeCalledWith({
            data: {
            a: 2,
            b: 3,
            result : 5
        }
        })
        expect(response.statusCode).toBe(200);
        expect(answer).toBe(5);
    })

    it("sending only one input" , async () =>
    {
        const response = await supertest(app).post("/sum").send({a : 2});
        const answer = response.body.message;
        expect(response.statusCode).toBe(400);
    })
})


