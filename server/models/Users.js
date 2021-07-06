module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );

  Users.associate = (models) => {
    Users.hasMany(models.Purchases, {
      onDelete: "cascade",
    });
  };
  return Users;
};
