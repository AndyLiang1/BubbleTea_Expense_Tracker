module.exports = (sequelize, DataTypes) => {
  const Purchases = sequelize.define(
    "Purchases",
    {
      flavour: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );
  return Purchases;
};
