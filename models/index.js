const Sequelize = require('sequelize');
const config = require('../config/config.json')['LADYBUG'];
const db = {};


const sequelize = new Sequelize(config.DBName, config.userName, config.password, {
    host: config.hostAddress,
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to database:', err);
});


const USER = sequelize.define('USER', {
    id: { field: "ID", type: Sequelize.STRING(100), primaryKey: true, allowNull: false },
    pw: { field: "PW", type: Sequelize.STRING(200) },
    age: { field: "AGE", type: Sequelize.INTEGER },
    gender: { field: "GENDER", type: Sequelize.STRING(1) },
    favorite1: { field: "FAVORITE1", type: Sequelize.STRING(100) },
    favorite2: { field: "FAVORITE2", type: Sequelize.STRING(100) },
    favorite3: { field: "FAVORITE3", type: Sequelize.STRING(100) },
    picks: { field: "PICKS", type: Sequelize.STRING(2000) },
    recommendation: { field: "RECOMMENDATION", type:Sequelize.STRING(200) }
});

const PRFINFO = sequelize.define('PRFINFO', {
    prf_id: { field:'MT20ID', type: Sequelize.STRING(8), primaryKey: true, allowNull: false },
    plc_id: { field:'MT10ID', type: Sequelize.STRING(8) },
    prf_name: { field:'PRFNM' ,type: Sequelize.STRING(2000) },
    date_from: { field:'PRFPDFROM', type: Sequelize.DATE(6) },
    date_to: { field:'PRFPDTO', type: Sequelize.DATE(6) },
    plc_name: { field: 'FCLTYNM', type: Sequelize.STRING(2000) },
    cast: { field: 'PRFCAST', type: Sequelize.STRING(400) },
    crew: { field: 'FCFCREW', type: Sequelize.STRING(50) },
    runtime: { field: 'PRFRUNTIME', type: Sequelize.STRING(20) },
    age: { field: 'PRFAGE', type: Sequelize.STRING(20) },
    enterprise: { field: 'ENTRPSNM', type: Sequelize.STRING(200) },
    price: { field: 'PCSEGUIDANCE', type: Sequelize.STRING(2000) },
    poster: { field: 'POSTER', type: Sequelize.STRING(200) },
    genre: { field: 'GENRENM', type: Sequelize.STRING(20) },
    state: { field: 'PRFSTATE', type: Sequelize.STRING(20) },
    openrun: { field: 'OPENRUN', type: Sequelize.STRING(1) },
    prf_time: { field: 'DTGUIDANCE', type: Sequelize.STRING(2000) }
});

const PRFINFO_CLONE = sequelize.define('PRFINFO_CLONE', {
    prf_id: { field:'MT20ID', type: Sequelize.STRING(8), primaryKey: true, allowNull: false },
    prf_name: { field:'PRFNM' ,type: Sequelize.STRING(2000) },
    cast: { field: 'PRFCAST', type: Sequelize.STRING(400) },
    plc_name: { field: 'FCLTYNM', type: Sequelize.STRING(2000) }
});

const PRFINFO_TEMP = sequelize.define('PRFINFO_TEMP', {
    prf_id: { field:'MT20ID', type: Sequelize.STRING(8), primaryKey: true, allowNull: false },
    cast_profile: { field: 'PRFCASTS', type: Sequelize.STRING(5000) },
    synopsis: { field: 'SYNOPSIS', type: Sequelize.STRING(5000) },
    review: { field: 'REVIEW', type: Sequelize.STRING(5000) }
});

const PLCINFO = sequelize.define('PLCINFO', {
    plc_id: { field:'MT10ID', type: Sequelize.STRING(8), primaryKey: true, allowNull: false },
    plc_name: { field: 'FCLTYNM', type: Sequelize.STRING(100) },
    plc_count: { field: 'MT13CNT', type: Sequelize.INTEGER.UNSIGNED },
    characteristic: { field: 'FCLTYCHARTR', type: Sequelize.STRING(20) },
    open_year: { field: 'OPENDE', type: Sequelize.INTEGER },
    seat_count: { field: 'SEATSCALE', type: Sequelize.INTEGER.UNSIGNED },
    tel: { field: 'TELNO', type: Sequelize.STRING(20) },
    url: { field: 'RELATEURL', type: Sequelize.STRING(200) },
    address: { field: 'ADRES', type: Sequelize.STRING(200) },
    latitude: { field: 'LA', type: Sequelize.DOUBLE },
    longitude: { field: 'LO', type: Sequelize.DOUBLE }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op;
db.USER = USER;
db.PRFINFO = PRFINFO;
db.PRFINFO_CLONE = PRFINFO_CLONE;
db.PRFINFO_TEMP = PRFINFO_TEMP;
db.PLCINFO = PLCINFO;

module.exports = db;