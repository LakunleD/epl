const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;

const server = require('../epl');
const { Team } = require('../models/team');

chai.use(chaiHttp);

describe('testing the team API', () => {
    
    let team_id;

    before( async() => {
        await mongoose.connect(process.env.EPL_TEST_MONGODB_URI,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            });
    })
    
    after( async() => {
        await Team.deleteMany({});
        await mongoose.disconnect();
    });

    describe('POST /teams', () => {
        it('create a new team', async () => {
            const team = {
                name: 'Chelsea',
                nickname: 'The Pensioners',
                stadium: 'Stamford Bridge',
                head_coach: 'Olakunle Dosunmu'
            }

            const res = await chai.request(server).post('/teams').send(team);
            const { body } = res;
            team_id = body.team._id;

            expect(res.statusCode).equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(true);
            expect(body.team).to.be.a('object');
            expect(body.team).to.have.property('_id');
            expect(body.team).to.have.property('name').equal(team.name);
            expect(body.team).to.have.property('nickname').equal(team.nickname);
            expect(body.team).to.have.property('stadium').equal(team.stadium);
            expect(body.team).to.have.property('head_coach').equal(team.head_coach);
        });

        it('should not create a new team because of an error on the name ', async () => {
            const team = {
                name: 'Che',
                nickname: 'The Pensioners',
                stadium: 'Stamford Bridge',
                head_coach: 'Olakunle Dosunmu'
            }

            const res = await chai.request(server).post('/teams').send(team);
            const { body } = res;

            expect(res.statusCode).equal(400);
            expect(body).to.have.property('success').equal(false);
            expect(body).to.have.property('message').equal('"name" length must be at least 4 characters long');
        });

        it('should not create a new team because of an error on the nickname ', async () => {
            const team = {
                name: 'Chelsea',
                nickname: 'The',
                stadium: 'Stamford Bridge',
                head_coach: 'Olakunle Dosunmu'
            }

            const res = await chai.request(server).post('/teams').send(team);
            const { body } = res;

            expect(res.statusCode).equal(400);
            expect(body).to.have.property('success').equal(false);
            expect(body).to.have.property('message').equal('"nickname" length must be at least 4 characters long');
        });

        it('should not create a new team because of an error on the stadium ', async () => {
            const team = {
                name: 'Chelsea',
                nickname: 'The blues',
                stadium: 'Stam',
                head_coach: 'Olakunle Dosunmu'
            }

            const res = await chai.request(server).post('/teams').send(team);
            const { body } = res;

            expect(res.statusCode).equal(400);
            expect(body).to.have.property('success').equal(false);
            expect(body).to.have.property('message').equal('"stadium" length must be at least 6 characters long');
        });

        it('should not create a new team because of an error on the head coach ', async () => {
            const team = {
                name: 'Chel',
                nickname: 'The blues',
                stadium: 'Stamford Bridge',
                head_coach: 'Kunle'
            }

            const res = await chai.request(server).post('/teams').send(team);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.have.property('success').equal(false);
            expect(body).to.have.property('message').equal('"head_coach" length must be at least 6 characters long');
        });
    });

    describe('GET /teams', () => {
        it('should fetch all teams', async () => {
            const res = await chai.request(server).get('/teams');
            const { body } = res;
            expect(res.statusCode).equal(200);
            expect(body).to.have.property('success').equal(true);
            expect(body.teams).to.be.a('array');
        });
    });

    describe('GET /teams/:id', () => {
        it('should fetch a team by ID', async () => {
            const res = await chai.request(server).get(`/teams/${team_id}`);
            const { body } = res;
            expect(res.statusCode).equal(200);
            expect(body).to.have.property('success').equal(true);
        });
    });
});