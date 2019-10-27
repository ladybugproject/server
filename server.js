const express = require('express');
const cors = require('cors');
const models = require('./models/index.js');


const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;


// status는 무조건 200으로, 실제 status는 같이 보내기
app.get('/', (req, res, next) => {
    res.send('[오머나]오늘 머해 나가자! - API Server');
});

// PRFINFO test
// app.get('/prfinfo', (req, res) => {
//     models.PRFINFO.findAll({limit:21})
//     .then(results => {
//         results[0] = {'status':200};
//         res.status(200).json(results);
//     })
//     .catch(err => {
//         const stat = [];
//         stat.push({'status':400});
//         stat.push({'error':err.message});
//         res.status(200).json(stat);
//     });
// });

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
        stat.push({'error':err.message});
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
        stat.push({'error':err.message});
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
        stat.push({'error':err.message});
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
        stat.push({'error':err.message});
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
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err.message});
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
        stat.push({'error':err.message});
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
        stat.push({'error':err.message});
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
            date_to: { [models.Op.gte]: new Date() },
            poster: { [models.Op.not]: null }
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
        stat.push({'error':err.message});
        res.status(200).json(stat);
    });
});

// 임시로 만들어 둔 코드
app.get('/playing/recommendation', (req, res) => {
    models.PRFINFO.findAll({
        order: [['prf_id', 'DESC']],
        offset: 2,
        limit: 5,
        where: {
            date_from: { [models.Op.lte]: new Date() },
            date_to: { [models.Op.gte]: new Date() },
            poster: { [models.Op.not]: null }
        }
    })
    .then(result => {
        const results = [];
        results.push({'status':200});
        results.push({'result':result.reverse()});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err.message});
        res.status(200).json(stat);
    });
});

// 검색
// req : 검색 키워드(공연 제목, 공연 장소, 배우), 시작 index, 마지막 index + 1
// res : 검색 결과
app.get('/prfinfo', (req, res) => {
    const keyword = req.query.keyword.replace(/ /gi, "");
    const startFrom = parseInt(req.query.startFrom);
    const endTo = parseInt(req.query.endTo);

    models.PRFINFO.findAll({
        where: {
            [models.Op.or]: { prf_name: { [models.Op.like]: '%' + keyword + '%' },
            cast: { [models.Op.like]: '%' + keyword + '%' },
            plc_name: { [models.Op.like]: '%' + keyword + '%' } },
            poster: { [models.Op.not]: null }
        },
        offset: startFrom,
        limit: endTo - startFrom
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
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err.message});
        res.status(200).json(stat);
    });
});

app.get('/prfinfo/:pid', (req, res) => {
    const pid = req.params.pid;

    models.sequelize.query("SELECT PI.MT20ID AS prf_id, PI.MT10ID AS plc_id, PI.PRFNM AS prf_name, PI.PRFPDFROM AS date_from, PI.PRFPDTO AS date_to, " +
    "PI.FCLTYNM AS plc_name, PI.PRFCAST AS cast, PIT.PRFCASTS AS cast_profile, PI.FCFCREW AS crew, PI.PRFRUNTIME AS runtime, PI.PRFAGE AS age, " +
    "PI.ENTRPSNM AS enterprise, PI.PCSEGUIDANCE AS price, PI.POSTER AS poster, PI.GENRENM AS genre, PI.PRFSTATE AS state, PI.OPENRUN AS openrun, PI.DTGUIDANCE AS prf_time, " +
    "PIT.SYNOPSIS AS synopsis, PIT.REVIEW AS review FROM PRFINFO AS PI LEFT JOIN PRFINFO_TEMP AS PIT ON PI.MT20ID=PIT.MT20ID WHERE PI.MT20ID='" + pid + "';")
    .then(result => {
        const results = [];

        const profiles = result[0][0].cast_profile.split('\n');
        const cast_profile = [];
        for(let i=0; i<profiles.length/2; i++) {
            const new_profile = {};
            new_profile.name = profiles[i*2];
            new_profile.profile = profiles[i*2+1];

            cast_profile.push(new_profile);
        }
        result[0][0].cast_profile = cast_profile;

        result[0][0].synopsis = result[0][0].synopsis.replace(/\n/gi, " ");

        const reviews = result[0][0].review.split('\n');
        const review = [];
        for(let i=0; i<reviews.length/2; i++) {
            const new_review = {};
            new_review.score = parseInt(reviews[i*2]);
            new_review.comment = reviews[i*2+1];

            review.push(new_review);
        }
        result[0][0].review = review;

        results.push({'status':200});
        results.push({'result':result[0][0]});
        res.status(200).json(results);
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err.message});
        res.status(200).json(stat);
    });
});

// 찜 목록 조회
// req : 유저ID
// res : 200/해당 유저의 찜목록(리스트 형식) - 해당 유저가 있음, 400/error message - 기타 예외 상황
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
        const stat = [];
        stat.push({'status':400});
        stat.push({'error':err.message});
        res.status(200).json(stat);
    });
});

// 찜 목록 추가
// req: 유저ID, 찜한 공연ID
// res: 201/Created - 삽입 성공 or 이미 있음, 403/Forbidden - 유저 정보 없음, 404/Not Found - 해당 공연이 없음, 400/error message - 기타 예외 상황
app.post('/picking', (req, res) => {
    const uid = req.body.uid;
    const pid = req.body.pid;

    models.USER.findOne({
        attributes: ['picks'],
        where: { id: uid }
    })
    .then(user_result => {
        const currentPicks = user_result.dataValues.picks;

        models.PRFINFO.findAll({
            where: { prf_id: pid }
        })
        .then(prf_result => {
            if(prf_result == false) {
                const results = [];
                results.push({'status':404});
                results.push({'result':'Not Found'});
                res.status(200).json(results);
            }
            else {
                if(currentPicks.includes(pid) === false) {
                    models.USER.update({
                        picks: currentPicks + ',' + pid
                    }, {
                        where: { id: uid }
                    })
                    .then(() => {
                        const results = [];
                        results.push({'status':201});
                        results.push({'result':'Created'});
                        res.status(200).json(results);
                    })
                    .catch(err => {
                        const stat = [];
                        stat.push({'status':400});
                        stat.push({'error':err.message});
                        res.status(200).json(stat);
                    });
                }
                else {
                    const results = [];
                    results.push({'status':201});
                    results.push({'result':'Created'});
                    res.status(200).json(results);
                }
            }
        })
        .catch(err => {
            const results = [];
            results.push({'status':400});
            results.push({'error':err.message});
            res.status(200).json(results);
        });
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':403});
        stat.push({'result':'Forbidden'});
        res.status(200).json(stat);
    });
});

// 찜 목록 추가
// req: 유저ID, 찜한 공연ID
// res: 200/Deleted - 삭제 성공 or 이미 없음, 403/Forbidden - 유저 정보 없음, 400/error message - 기타 예외 상황
app.delete('/picking', (req, res) => {
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
                results.push({'result':'Deleted'});
                res.status(200).json(results);
            })
            .catch(err => {
                const stat = [];
                stat.push({'status':400});
                stat.push({'error':err.message});
                res.status(200).json(stat);
            });
        }
        else {
            const results = [];
            results.push({'status':200});
            results.push({'result':'Deleted'});
            res.status(200).json(results);
        }
    })
    .catch(err => {
        const stat = [];
        stat.push({'status':403});
        stat.push({'result':'Forbidden'});
        res.status(200).json(stat);
    });
});

// PRFINFO -> PRFINFO_CLONE으로 데이터 복사를 위한 임시 배치 코드
// 한 번에 많은 양을 하면 데이터가 누락되어 timeout이 있음
// 3000단위로 옮기는 것을 권장
app.post('/clone', (req, res) => {
    models.PRFINFO.findAll({
        attibutes: ['prf_id', 'prf_name', 'cast', 'plc_name']//,
        //offset: 15000,
        //limit: 3000
    })
    .then(result => {
        result.forEach((element, index) => {
            models.PRFINFO_CLONE.create({
                prf_id: element.prf_id.replace(/ /gi, ""),
                prf_name: element.prf_name.replace(/ /gi, ""),
                cast: element.cast.replace(/ /gi, ""),
                plc_name: element.plc_name.replace(/ /gi, "")
            })
            .then(() => {
                if(index === result.length - 1) {
                    res.status(200).json("Clone Success!");
                }
            })
            .catch(err => {
                console.log("second err");
                console.log(err.message);
            })
        });
    })
    .catch(err => {
        console.log("first err");
        console.log(err.message);
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});