const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { expect } = chai;

const server = require('../epl');
const { Result } = require('../models/result');

chai.use(chaiHttp);

describe('testing the result API', async() => {
    let team1;
    let team2;
    let team1_id;
    let team2_id;

    after( async() => {
        await mongoose.disconnect();
    });

    describe('POST /results', () => {
        it('post the result', async () => {

            team1 = {
                name: 'Chelsea',
                nickname: 'The Pensioners',
                stadium: 'Stamford Bridge',
                head_coach: 'Olakunle Dosunmu'
            }
        
            const res1 = await chai.request(server).post('/teams').send(team1);
        
            team2 = {
                name: 'Arsenal',
                nickname: 'Gunners',
                stadium: 'Emirates',
                head_coach: 'Mikel Arteta'
            }
        
            const res2 = await chai.request(server).post('/teams').send(team2);
        
            team1_id = res1.body.team._id;
            team2_id = res2.body.team._id;

            const result = {
                home_id: team1_id,
                away_id: team2_id,
                home_goal: 2,
                away_goal: 2
            }


            const res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(201);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(true);
            expect(body.result).to.be.a('object');
            expect(body.result).to.have.property('_id');
            expect(body.result).to.have.property('home_id').equal(result.home_id);
            expect(body.result).to.have.property('away_id').equal(result.away_id);
            expect(body.result).to.have.property('home_goal').equal(result.home_goal);
            expect(body.result).to.have.property('away_goal').equal(result.away_goal);
        });

        it('return an error because same team cannot play each other', async () => {
            const result = {
                home_id: team1_id,
                away_id: team1_id,
                home_goal: 2,
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('same team cannot play against each other');
        });

        it('return an error because home team is required', async () => {
            const result = {
                home_id: '',
                away_id: team1_id,
                home_goal: 2,
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('"home_id" is not allowed to be empty');
        });

        it('return an error because away team is required', async () => {
            const result = {
                home_id: team1_id,
                away_id: '',
                home_goal: 2,
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('"away_id" is not allowed to be empty');
        });

        it('return an error because home_goal must be a number', async () => {
            const result = {
                home_id: team1_id,
                away_id: team2_id,
                home_goal: '',
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('"home_goal" must be a number');
        });

        it('return an error because away_goal must be a number', async () => {
            const result = {
                home_id: team1_id,
                away_id: team2_id,
                home_goal: 2,
                away_goal: ''
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('"away_goal" must be a number');
        });

        it('return an error because home_id must be an ObjectId', async () => {
            const result = {
                home_id: 'team1_id',
                away_id: team2_id,
                home_goal: 2,
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('Result validation failed: home_id: Cast to ObjectID failed for value "team1_id" at path "home_id"');
        });

        it('return an error because away_id must be an ObjectId', async () => {
            const result = {
                home_id: team1_id,
                away_id: 'team2_id',
                home_goal: 2,
                away_goal: 2
            }


            let res = await chai.request(server).post('/results').send(result);
            const { body } = res;
            
            expect(res.statusCode).equal(400);
            expect(body).to.be.a('object');
            expect(body).to.have.property('success').equal(false);
            expect(body.message).to.be.a('string').equal('Result validation failed: away_id: Cast to ObjectID failed for value "team2_id" at path "away_id"');
        });
    });

    describe('GET /results', () => {
        it('by default, it should retrieve the last 10 results for a team', async () => {
            const res = await chai.request(server).get(`/results/${team1_id}`);
            const { body } = res;

            expect(res.statusCode).equal(200);
            expect(body).to.have.property('success').equal(true);
            expect(body.results).to.be.a('array');
            expect(body.results).length.to.be.lessThan(10);
        });

        it('it should return at most 2 results', async () => {
            const res = await chai.request(server).get(`/results/${team1_id}?limit=2`);
            const { body } = res;
            
            expect(res.statusCode).equal(200);
            expect(body).to.have.property('success').equal(true);
            expect(body.results).to.be.a('array');
            expect(body.results).length.to.be.lessThan(2);
        });
    });
});