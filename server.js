const express = require('express');
const cors = require('cors');
const models = require('./models/index.js');


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;


// status는 무조건 200으로, 실제 status는 같이 보내기
app.get('/', (req, res, next) => {
    res.send('Test~~~');
});

// PRFINFO test
app.get('/prfinfo', (req, res) => {
    models.PRFINFO.findAll({limit:21})
    .then(results => {
        results[0] = {'status':200};
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// PLCINFO test
app.get('/plcinfo', (req, res) => {
    models.PLCINFO.findAll({limit:11})
    .then(results => {
        results[0] = {'status':200};
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
    });
});

// test
app.get('/test', (req, res) => {
    models.PRFINFO.findAll({limit:21})
    .then(results => {
        results[0] = {'status':200};
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// req : X
// res : 공연ID
app.get('/performance-ids', (req, res) => {
    models.PRFINFO.findAll({ attributes: ['prf_id'] })
    .then(result => {
        const results = [];
        results.push({'status':200});
        const ids = [];
        result.forEach(function(element) {
            ids.push(element['prf_id']);
        })
        results.push({'result':ids});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// req : PRFINFO 모든 데이터
// res : success/fail
app.post('/performance-ids', (req, res) => {
    const result = req.body.result;

    result.forEach((element, index) => {
        models.PRFINFO.create({
            prf_id: element[0],
            plc_id: element[1],
            prf_name: element[2],
            date_from: element[3],
            date_to: element[4],
            plc_name: element[5],
            cast: element[6],
            crew: element[7],
            runtime: element[8],
            age: element[9],
            enterprise: element[10],
            price: element[11],
            pster: element[12],
            genre: element[13],
            state: element[14],
            openrun: element[15],
            prf_time: element[16]
        })
        .then(() => {
            if(index == element.length - 1) {
                const stat = [];
                stat.push({'status':201});
                stat.push({'result':'success'});
                res.status(200).json(stat);
            }
        })
        .catch(err=> {
            const stat = [];
            stat.push({'status':400});
            stat.push({'result':'fail'});
            res.status(400).json(stat);
        });
    });
});

// req : 유저ID, 유저PW, 나이, 성별, 선호장르1, 선호장르2, 선호장르3
// res : 
app.post('/signup', (req, res) => {
    const id = req.body.ID;
    const pw = req.body.PW;
    const age = req.body.AGE;
    const gender = req.body.GENDER;
    const favorite1 = req.body.FAVORITE1;
    const favorite2 = req.body.FAVORITE2;
    const favorite3 = req.body.FAVORITE3;

    models.sequelize.query("INSERT INTO USER(ID, PW, AGE, GENDER, FAVORITE1, FAVORITE2, FAVORITE3) VALUES('" +
    id + "', PASSWORD('" + pw + "'), " + age + ", '" + gender + "', '" + favorite1 + "', '" + favorite2 + "', '" + favorite3 + "');")
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push({'result':result});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// req : 유저ID
// res : 
app.get('/checkID', (req, res) => {
    const uid = req.query.ID;

    models.USER.findOne({
        where: { id: uid }
    })
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push(result[0]);
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// req : 유저ID, 유저PW
// res : 
app.post('/login', (req, res) => {
    const id = req.body.ID;
    const pw = req.body.PW;

    // 로그인 성공 시, 실패 시 처리를 나누어야 함
    models.sequelize.query("SELECT COUNT(*) as COUNT FROM USER WHERE ID = '" +
    id + "' AND PW = PASSWORD('" + pw + "');")
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push(result[0]);
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// req : None
// res : 공연ID, 공연명, 장르, 공연시설명
app.get('/recommendation', (req, res) => {
    models.PRFINFO.findAll({
        attributes: ['prf_id', 'prf_name', 'genre', 'plc_name'],
        where: {
            date_from: { [models.Op.lte]: new Date() },
            date_to: { [models.Op.gte]: new Date() }
        }
    })
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push({'result':result});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// 유저 별 추천 데이터
// req : 유저ID(현재는 default)
// res : 
app.post('/recommendation', (req, res) => {
    models.PRFINFO.findAll()
    .then(result => {

    })
    .catch(err => {
        console.error(err);
    });
});

// 현재 상영중
// req : X
// res : 현재 상영중인 공연 중 최근 기준으로 상위 5개
app.get('/playing/now', (req, res) => {
    models.PRFINFO.findAll({
        order: [['prf_id', 'DESC']],
        limit: 5,
        where: {
            date_from: { [models.Op.lte]: new Date() },
            date_to: { [models.Op.gte]: new Date() }
        }
    })
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push({'result':result});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// 검색
// req : 검색 키워드(공연 제목, 공연 장소, 배우)
// res : 검색 결과
app.get('/searching', (req, res) => {
    const keyword = req.query.keyword;

    models.PRFINFO.findAll({
        where: {
            [models.Op.or]: { prf_name: { [models.Op.like]: '%' + keyword + '%' },
            cast: { [models.Op.like]: '%' + keyword + '%' },
            plc_name: { [models.Op.like]: '%' + keyword + '%' } }
        }
    })
    .then(result => {
        const results = [];

        const datas  = [];
        result.forEach(function(element) {
            datas.push(element.dataValues);
        })

        results.push({'status':200});
        results.push({'result':datas});
        res.status(200).json(results);
    })
    .catch(err => {
        console.log(err);
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// 찜 목록 조회
// req : 유저ID
// res : 해당 유저의 찜목록
app.get('/picking', (req, res) => {
    const uid = req.query.uid;

    models.USER.findOne({
        attributes: ['picks'],
        where: { id: uid }
    })
    .then(result => {
        if(result === null) {
            const results = [];
            results.push({'status':200});
            results.push({'result':'no data'});
            res.status(200).json(results);
        }
        else if(result.dataValues.picks !== null) {
            const results = [];
            results.push({'status':200});
            results.push({'result':result.dataValues.picks.substring(1).split(',')});
            res.status(200).json(results);
        }
        else {
            const results = [];
            results.push({'status':200});
            results.push({'result':[]});
            res.status(200).json(results);
        }
    })
    .catch(err => {
        console.log(err);
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// 찜 목록 추가
// req: 유저ID, 찜한 공연ID
// res: 
app.post('/picking/insert', (req, res) => {
    const uid = req.body.uid;
    const pid = req.body.pid;

    models.USER.findOne({
        attributes: ['picks'],
        where: { id: uid }
    })
    .then(result => {
        const currentPicks = result.dataValues.picks;

        if(currentPicks.includes(pid) === false) {
            models.USER.update({
                picks: currentPicks + ',' + pid
            }, {
                where: { id: uid }
            })
            .then(() => {
                const results = [];
                results.push({'status':200});
                results.push({'result':'success'});
                res.status(200).json(results);
            })
            .catch(err => {
                const stat = [];
                stat.push({'status':400});
                stat.push({'error':err});
                res.status(200).json(stat);
            });
        }
        else {
            const results = [];
            results.push({'status':200});
            results.push({'result':'already included'});
            res.status(200).json(results);
        }
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});

// 찜 목록 추가
// req: 유저ID, 찜한 공연ID
// res: 
app.post('/picking/delete', (req, res) => {
    const uid = req.body.uid;
    const pid = req.body.pid;

    models.USER.findOne({
        attributes: ['picks'],
        where: { id: uid }
    })
    .then(result => {
        const currentPicks = result.dataValues.picks;

        if(currentPicks.includes(pid) === true) {

            models.USER.update({
                picks: currentPicks.replace(',' + pid, '')
            }, {
                where: { id: uid }
            })
            .then(() => {
                const results = [];
                results.push({'status':200});
                results.push({'result':'success'});
                res.status(200).json(results);
            })
            .catch(err => {
                const stat = [];
                stat.push({'status':400});
                stat.push({'error':err});
                res.status(200).json(stat);
            });
        }
        else {
            const results = [];
            results.push({'status':200});
            results.push({'result':'not include'});
            res.status(200).json(results);
        }
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err});
        res.status(200).json(stat);
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});