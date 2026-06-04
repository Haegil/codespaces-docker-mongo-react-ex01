const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: -1 });

    res.json({
      message: "할 일 목록 조회 성공",
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      message: "할 일 목록 조회 중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, done } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "title은 필수 입력값입니다."
      });
    }

    const newTodo = new Todo({
      title,
      done
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      message: "할 일이 등록되었습니다.",
      data: savedTodo
    });
  } catch (error) {
    res.status(500).json({
      message: "할 일 등록 중 오류가 발생했습니다.",
      error: error.message
    });
  }
});

module.exports = router;