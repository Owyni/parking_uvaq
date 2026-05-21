     const newUser = await User.create({
      name,
      matricula,
      correo,
      roleId,    // ID del catálogo de Roles
      carreraId  // ID del catálogo de Carreras
    });

    const newVehicle = await Vehicle.create({
      placa,
      modelo,
      colorId,
      tipoVehiculoId,
      userId: newUser.id // Aquí se genera la relación gracias a la llave foránea
    });

    return res.status(201).json({
      message: 'Usuario y vehículo registrados exitosamente.',
      data: {
        user: newUser,
        vehicle: newVehicle
      }
    });
