require('dotenv').config();

const express = require('express')
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

const dbName = 'cars';
const collectionName = 'cars';

// 단순 forward 처리 함수
const forward = (req, res, target, obj)=>{
    req.app.render(target, obj, (err, html) => {
        if(err) throw err;
        res.end(html);
    });
};

router.get('/', async (req, res) => {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const carList = await collection.find().toArray();

    await client.close();

    forward(req, res, "CarList", { carList });
    
    // res.status(200).json({message: "전체 조회에 성공했습니다.", data: carList});
});

router.get('/detail', async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const target = req.query['id'];

    console.log(target)

    const found = await collection.findOne({_id: new ObjectId(target)});
    forward(req, res, "CarDetail", { car: found });

    await client.close();

    // res.status(200).json({message: "단건 조회에 성공했습니다.", data: found});
});

router.post('/', async (req, res) => {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const newCar = req.body;

    const { name, price, company, year } = newCar;

    console.log(newCar);

    await collection.insertOne({name, price, company, year});

    await client.close();

    res.redirect('/cars');
    // res.status(203).json({message: "저장에 성공했습니다."});
})

router.put('/:id', async (req, res) => {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const updateCar = req.body;
    const target = req.params.id;
    await collection.updateOne({_id: target}, updateCar);

    await client.close();

    res.status(200).json({message: "업데이트에 성공했습니다."});
})

router.delete('/:id', async (req, res) => {
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const target = req.params.id;
    await collection.deleteOne({_id: target});

    await client.close();

    res.status(201).json({message: "단건 삭제에 성공했습니다."});
})

/** ==================================================
 * EXAMPLE API
================================================== */

// 새 데이터 입력 페이지로 forward
router.get('/input', (req, res)=>{
    forward(req, res,'CarInput', {});
});

// 상세보기 페이지로 forward
router.get('/modify', async (req, res) => {
    try{
        await client.connect();
        const db = client.db(dbName);
        const cars = db.collection(collectionName);
        const car = await cars.findOne({_id: new ObjectId(req.query.id)},{});
        forward (req, res, 'CarModify', {car});
    } finally {
        await client.close();
    }
});

// DB에 데이터 수정
// bodyParser 미들웨어가 먼저 준비 되어야 합니다. 
router.post('/modify', async (req, res) => {
    try{
        await client.connect();
        const {id, name, price, company, year} = req.body;
        const db = client.db(dbName);
        const cars = db.collection(collectionName);
        await cars.updateOne({_id: new ObjectId(id)}, {$set:{name, price, company, year}});
        res.redirect("/cars");
    } finally {
        client.close();
    }
});

// car 삭제 후 list로 redirection
router.get('/delete', async (req, res) => {
    try{
        await client.connect();
        const db = client.db(dbName);
        const cars = db.collection(collectionName);
        await cars.deleteOne({_id: new ObjectId(req.query.id)});
        res.redirect("/cars");
    } finally {
        await client.close();
    }
});

module.exports = router;