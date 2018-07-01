const { Router } = require('express')

const router = Router()

// Mock Users
// const schedulers = [
//   { name: 'Alexandre' },
//   { name: 'Pooya' },
//   { name: 'Sébastien' }
// ]

const schedulers = [
  {
   id:1, 
   name:'Opening Hours',
   set:[
      { "scheduleId" : 4523 , "day" : "SUN" , "start" : 540 , "end" : 1200 },
      { "scheduleId" : 4529 , "day" : "MON" , "start" : 540 , "end" : 1200 },
      { "scheduleId" : 4528 , "day" : "TUE" , "start" : 540 , "end" : 1200 },
      { "scheduleId" : 4527 , "day" : "WED" , "start" : 540 , "end" : 1200 },
      { "scheduleId" : 4526 , "day" : "THU" , "start" : 540 , "end" : 1200 },      
      { "scheduleId" : 4525 , "day" : "FRI" , "start" : 540 , "end" : 1200 },
      { "scheduleId" : 4524 , "day" : "SAT" , "start" : 540 , "end" : 1200 }
   ]
  },
  {
   id:2, 
   name:'Lunch Specials',
   set:[
      { "scheduleId" : 4523 , "day" : "SUN" , "start" : 660 , "end" : 900 },
      { "scheduleId" : 4529 , "day" : "MON" , "start" : 660 , "end" : 900 },
      { "scheduleId" : 4528 , "day" : "TUE" , "start" : 660 , "end" : 900 },
      { "scheduleId" : 4527 , "day" : "WED" , "start" : 660 , "end" : 900 },
      { "scheduleId" : 4526 , "day" : "THU" , "start" : 660 , "end" : 900 },      
      { "scheduleId" : 4525 , "day" : "FRI" , "start" : 660 , "end" : 900 },
      { "scheduleId" : 4524 , "day" : "SAT" , "start" : 660 , "end" : 900 }
   ]
  }
]

/* GET schedulers listing. */
router.get('/schedulers', function (req, res, next) {
  res.json(schedulers)
})

/* GET scheduler by ID. */
router.get('/schedulers/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < schedulers.length) {
    res.json(schedulers[id])
  } else {
    res.sendStatus(404)
  }
})


router.post('/schedulers/create', function (req, res, next) {
  res.json(schedulers)
})

router.post('/schedulers/update', function (req, res, next) {  
  res.json(schedulers)
})

module.exports = router
