var express = require('express');
var router = express.Router();

const boardService = require('../src/service/boardService');

router.post("/getAllNotice", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectAll(req.body, "NOTICE");

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  };
})

router.post("/getAllFAQ", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectAll(req.body, "FAQ");

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})

router.post("/getCategory2FAQ", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectAll(req.body, "FAQ");

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})

router.post("/getRecentNotice",async(req, res, next)=>{
  console.log(req.body);
  const result = await boardService.getLatestBoard();
  
  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})



/**
 * YJ
 */

router.post("/insertReview", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.insertReview(req.body);
  console.log(result)
  if(result.message != statusCode.SUCCESS){
    res.status(500).send(result.message);
  }else{
    res.status(200).send(result);
  }
})



router.post("/getReviewByUserId", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectReviewByUserId(req.body);

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})



router.post("/getReviewByProduct", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectReviewByProduct(req.body);

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})



router.post("/getReviewByUserAndProduct", async (req, res, next)=>{
  console.log(req.body);
  const result = await boardService.selectReviewByUserAndProduct(req.body);

  if(result == "error"){
    res.sendStatus(500);
  }else{
    res.send(result);
  }
})
 /**
  * YJ
  */

module.exports = router ;