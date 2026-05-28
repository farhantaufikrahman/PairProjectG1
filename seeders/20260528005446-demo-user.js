"use strict";

const fs = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./user.json", "utf-8"));
    data.map((el) => {
      el.createdAt = el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert(`Users`, data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
