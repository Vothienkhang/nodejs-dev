'use strict';

module.exports = {
    
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'khangvo@gmail.com',
        password: 'Khang@1234',
        firstName: 'Khang',
        lastName: 'Vo',
        address: 'HCM City',
        phonenumber: "0919258999",
        gender: 1,
        image: "",
        roleID: 'R1',
        positionID: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'John',
        lastName: 'Vo',
        email: 'khangvo1@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
