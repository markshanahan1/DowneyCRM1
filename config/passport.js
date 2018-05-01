const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Company = require('../models/company');
const config = require('../config/database');

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload.data._id);
      Company.getCompanyById(jwt_payload.data._id, (err, company) => {
        if(err) {
          return done(err, false);
        }
  
        if(company) {
          return done(null, company);
        } else {
          console.log("now looking inside employees")
          Company.find({},function(err, company) {
            console.log(company);
            if (err) throw res.json({success: false, msg:'No User Found'});
         
            for(let i = 0 ; i< company.length;i++){
              
              for(let k = 0 ; k< company[i].employees.length && company[i] !== undefined; k++){
                if(err) throw err; 
                console.log("now looking inside nested employees")
                if(company[i].employees[k]._id == jwt_payload.data._id) {
                    console.log('found it');
                         
                  if(err) {
                    return done(err, false);
                  }
                  
                  if(company[i].employees[k]) {
                    let emp = {
                      _id:company[i].employees[k]._id,
                      empName: company[i].employees[k].empName,
                      empEmail: company[i].employees[k].empEmail,
                      empUsername: company[i].employees[k].empUsername,
                      empDob:company[i].employees[k].empDob,
                      empPhone:company[i].employees[k].empPhone,
                      empHrRate:company[i].employees[k].empHrRate,
                      empPosition:company[i].employees[k].empPosition,
                      empPassword:company[i].employees[k].empPassword,
                      compId:company[i]._id
                    };

                    
                    console.log("---------");
                    console.log(emp);
                    console.log("---------");
                    return done(null, emp);
                  } else {
                    return done(null, false);
                  }
                }
              }
            }
          });
        }
      });
      
            
    }));
  
}

