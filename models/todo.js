"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const list_before = await this.overdue();
      list_before.map((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      const list_now = await this.dueToday();
      list_now.map((item) => {
        console.log(item.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      const list_next = await this.dueLater();
      list_next.map((item) => {
        console.log(item.displayableString());
      });
    }

    static async overdue() {
      const date = new Date();
      const todo = await Todo.findAll({
        where: { dueDate: { [Oper.lt]: date.toLocaleDateString("en-CA") } },
        order: [["id"]],
      });
      return todo;
    }

    static async dueToday() {
      const date = new Date();
      const todo = await Todo.findAll({
        where: { dueDate: { [Oper.eq]: date.toLocaleDateString("en-CA") } },
        order: [["id"]],
      });
      return todo;
    }

    static async dueLater() {
      const date = new Date();
      const todo = await Todo.findAll({
        where: { dueDate: { [Oper.gt]: date.toLocaleDateString("en-CA") } },
        order: [["id"]],
      });
      return todo;
    }

    static async markAsComplete(id) {
      try {
        return Todo.update({ completed: true }, { where: { id: id } });
      } catch (error) {
        console.error(error);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let duedate =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : `${this.dueDate}`;
      return `${this.id}. ${checkbox} ${this.title} ${duedate}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};