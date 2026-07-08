var conexion = new Mongo("mongodb+srv://escar_esteban:escar098@cluster0.gyh4c8f.mongodb.net/");
var db = conexion.getDB("BaseDeDatos");

print("=== CONEXIÓN EXITOSA ===");
// =======================================
// 1. LOGIN (Buscar por email)
// =======================================
print("\n1. LOGIN");
var email = "ana@gmail.com";
var usuario = db.usuarios.findOne({ email: email });
if (usuario) {
    print("Acceso permitido");
    printjson(usuario);
    // =======================================
    // 2. Listar usuarios menores de 10 años ($lt)
    // =======================================
    print("2. Usuarios menores de 10 años");
    db.usuarios.find(
        { edad: { $lt: 10 } }
    ).forEach(printjson);
    // =======================================
    // 3. Actualizar perfil
    // =======================================
    print("\n3. Actualizando perfil");
    db.usuarios.updateOne(
        { email: "ana@gmail.com" },
        {
            $set: {
                "perfil.telefono": "3209999999",
                "perfil.ciudad": "Tunja"
            }
        }
    );
    print("Perfil actualizado");
    // =======================================
    // 4. Insertar nueva anidación (hobby)
    // =======================================
    print("\n4. Agregando hobby");
    db.usuarios.updateOne(
        { email: "ana@gmail.com" },
        {
            $push: {
                hobbies: {
                    nombre: "Natación",
                    frecuencia: "Mensual"
                }
            }
        }
    );
    print("Hobby agregado");
    // =======================================
    // 5. Listar todos
    // =======================================
    print("5. Todos los usuarios");
    db.usuarios.find().forEach(printjson);
    // =======================================
    // 6. Buscar por ciudad
    // =======================================
    print("6. Usuarios de Bogotá");
    db.usuarios.find(
        {
            "perfil.ciudad": "Bogotá"
        }
    ).forEach(printjson);
    // =======================================
    // 7. Usuarios mayores de edad
    // =======================================
    print("\n7. Usuarios mayores de edad");
    db.usuarios.find(
        {
            edad: { $gte: 18 }
        }
    ).forEach(printjson);
    // =======================================
    // 8. Ordenar por edad
    // =======================================
    print("\n8. Ordenados por edad");
    db.usuarios.find().sort(
        {
            edad: 1
        }
    ).forEach(printjson);
    // =======================================
    // 9. Buscar usuarios con hobbies
    // =======================================
    print("\n9. Usuarios con hobbies");
    db.usuarios.find(
        {hobbies: { $ne: [] }}
    ).forEach(printjson);
    // =======================================
    // 10. Eliminar un hobby
    // =======================================
    print("\n10. Eliminar hobby Dibujar");

    db.usuarios.updateOne(
        {email: "ana@gmail.com"},
        {$pull: {hobbies: {nombre: "Dibujar"}}
        }
    );
    print("Hobby eliminado");
} else {
    print("Usuario no existe.");
    print("No se ejecutan las demás consultas.");

}