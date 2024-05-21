import express from 'express';
import bodyParser from 'body-parser'
import {z}from 'zod'
import {prismaClient} from './connect'

export const app = express();

const sumInput = z.object({
    a : z.number(),
    b : z.number()
})
app.use(bodyParser.json());

app.post("/sum" , async(req , res) =>
{
    const a = req.body.a;
    const b = req.body.b;
    const {success} = sumInput.safeParse(req.body)

    if(!success)
    {
        return res.status(400).send({message : "all params not found!"});
    }
   const answer = a + b;
    const response = await prismaClient.sum.create({
        data : {
            a : a,
            b : b,
            result : answer
        }
    })
    


    res.json({
        answer : answer,
        id: response.id
    })
    
})

app.get("/sum", (req, res) => {
    const parsedResponse = sumInput.safeParse({
        a: Number(req.headers["a"]),
        b: Number(req.headers["b"])
    })
    
    if (!parsedResponse.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const answer = parsedResponse.data.a + parsedResponse.data.b;

    res.json({
        answer
    })
});