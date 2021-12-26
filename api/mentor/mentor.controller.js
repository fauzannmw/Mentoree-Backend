const { getAllMentor, getMentor, getMentorWithEmail, postMentor } = require('./mentor.service');
const { ERROR, SUCCESS } = require('../respon');
const { compareSync, genSaltSync, hashSync } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const salt = genSaltSync(10);

module.exports = {
    getAllMentor: (req, res) => {
        getAllMentor((error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 403, "no data available");
            return SUCCESS(res, 200, result);
        });
    },
    getMentor: (req, res) => {
        getMentor(req.params.id, (error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 404, "data not found");
            return SUCCESS(res, 200, result);
        });
    },
    register: (req, res) => {
        req.body.password = hashSync(req.body.password, salt);
        postMentor(req.body, (error, result) => {
            if(error) return ERROR(res, 500, error);

            getMentor(result[0].id_mentor, (errors, results) => {
                if(errors) return ERROR(res, 500, errors);

                delete results[0].password;
                results[0]["token"] = sign({mentor: results}, "HS256", {expiresIn: "60m"});
                return SUCCESS(res, 200, results);
            });
        });
    },
    login: (req, res) => {
        getMentorWithEmail(req.body.email, (error, result) => {
            if(error) return ERROR(res, 500, error);

            if(result.length == 0) return ERROR(res, 404, "account not found or incorrect email");
            const verif = compareSync(req.body.password, result[0].password);
            if(!verif) return ERROR(res, 403, "incorrect password");

            delete result[0].password;
            result[0]["token"] = sign({mentor: result}, "HS256", {expiresIn: "60m"});
            return SUCCESS(res, 200, result);
        })
    }
}