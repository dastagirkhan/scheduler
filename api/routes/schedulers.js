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

router.post('/schedulers', function (req, res, next) { 
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];  
  console.log(_schedulers.length);
  req.body.id = uuidv4();
  _schedulers.push(req.body);  
  jsonfile.writeFileSync(file, _schedulers);  
  res.json(_schedulers)
})

router.post('/schedulers/update', function (req, res, next) { 
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];   
  _schedulers.map(function(_scheduler,i){      
        if(_scheduler.id == req.body.id){
            _schedulers[i] = req.body;
            jsonfile.writeFileSync(file, _schedulers);  
            res.json(_schedulers)
        }
  })  
})

router.delete('/schedulers/:id', function (req, res, next) {
  let _schedulers =  fs.existsSync(file) ? jsonfile.readFileSync(file) : [];   
  const id = req.params.id;
  console.log(id);
  _schedulers = _schedulers.filter((_scheduler) => _scheduler.id != id)
  jsonfile.writeFileSync(file, _schedulers); 
  res.json(_schedulers) 
});

module.exports = router
