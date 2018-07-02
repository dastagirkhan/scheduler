const { Router } = require('express')
const fs = require('fs');
const jsonfile = require('jsonfile')
const file = 'schedulers.json';
const uuidv4 = require('uuid/v4');
const router = Router()

const schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];

/* GET schedulers listing. */
router.get('/schedulers', function (req, res, next) {
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];   
  res.json(_schedulers)
})

router.get('/schedulers/create', function (req, res, next) {  
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];   
  res.json(_schedulers)
})

router.post('/schedulers/create', function (req, res, next) { 
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];    
  let exist = _schedulers.filter((_scheduler) => _scheduler.name == req.body.name)
  if(exist.length == 0){
    req.body.id = uuidv4();
    _schedulers.push(req.body);  
    jsonfile.writeFileSync(file, _schedulers);  
    res.json({status:'OK'})
  }else {
    res.json({status:'NOK','message':'Scheduler name already taken'})
  }
})

router.post('/schedulers/update', function (req, res, next) { 
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];
  let exist = _schedulers.filter((_scheduler) =>  _scheduler.id != req.body.id && _scheduler.name == req.body.name)
  if(exist.length == 0){
    _schedulers.map(function(_scheduler,i){      
        if(_scheduler.id == req.body.id){
            _schedulers[i] = req.body;
            jsonfile.writeFileSync(file, _schedulers);  
            res.json(_schedulers)
        }
    })  
  }else{
    res.json({status:'NOK','message':'Scheduler name already taken'})
  }     
})

router.delete('/schedulers/:id', function (req, res, next) {
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];   
  let id = req.params.id;  
  _schedulers = _schedulers.filter((_scheduler) => _scheduler.id != id)
  jsonfile.writeFileSync(file, _schedulers); 
  res.json(_schedulers) 
});

module.exports = router
