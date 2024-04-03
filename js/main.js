var artyom = new Artyom();
artyom.addCommands({
    indexes: ["movimientos", "busca"],
    action: function (i) {
        if (i == 0) {
            artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
                if (isFinal) {
                    ultimasEntradasEscuchadas = recognized.trim().toLowerCase().split(' ');
                    var segundaPalabra = ultimasEntradasEscuchadas[1];
                    $("#txtBuscar").val(segundaPalabra);
                    $.ajax({
                        url: "https://pokeapi.co/api/v2/pokemon/" + segundaPalabra,
                        type: "GET",
                        success: function (data) {    
                            var movimientos = data.moves.map(function (move) {
                                return move.move.name;
                            });
                            var movimientosHTML = "<div class='row'>";
                            var numColumnas = Math.ceil(movimientos.length / 20); // Calcular el número de columnas necesarias
                            var movimientosPorColumna = Math.ceil(movimientos.length / numColumnas); // Calcular el número de movimientos por columna

                            for (var i = 0; i < numColumnas; i++) {
                                movimientosHTML += "<div class='col'>";
                                for (var j = i * movimientosPorColumna; j < Math.min((i + 1) * movimientosPorColumna, movimientos.length); j++) {
                                    movimientosHTML += "<p>" + movimientos[j] + "</p>";
                                }
                                movimientosHTML += "</div>";
                            }
                            movimientosHTML += "</div>";
                    
                            $("#infoPokemon").html(movimientosHTML);
                        },
                        error: function (xhr, textStatus, errorThrown) {
                            if (xhr.status === 404) {
                                $("#infoPokemon").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>oh no!</strong> No encontramos ese pokemon, Intentalo nuevamente!.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`);
                            } else {
                                $("#infoPokemon").html("Hubo un error al buscar el Pokémon.");
                            }
                        }
                    });
                }
            });



        } else if (i == 1) {
            artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
                if (isFinal) {
                    ultimasEntradasEscuchadas = recognized.trim().toLowerCase().split(' ');
                    var segundaPalabra = ultimasEntradasEscuchadas[1];
                    $("#txtBuscar").val(segundaPalabra);
                }
            });
        }
    }
});

artyom.initialize({
    lang: "es-ES",
    debug: true,
    listen: true,
    continuous: true,
    speed: 0.9,
    mode: "normal"
});



$(document).ready(function () {
    $("#miBoton").on("click", function () {
        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + $("#txtBuscar").val(),
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                let pokemonInfoHTML = `
                    <div class="card">
                        <img src="${data.sprites.other['official-artwork'].front_default}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${data.name}</h5>
                            <p class="card-text">ID: ${data.id}</p>
                            <p class="card-text">Tipo: ${data.types.map(type => type.type.name).join(', ')}</p>
                            <p class="card-text">Habilidades: ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                            <p class="card-text">Altura: ${data.height}</p>
                            <p class="card-text">Peso: ${data.weight}</p>
                        </div>
                    </div>
                `;

                $("#infoPokemon").html(pokemonInfoHTML);

            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.status === 404) {
                    $("#infoPokemon").html(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>oh no!</strong> No encontramos ese pokemon, Intentalo nuevamente!.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`);
                } else {
                    $("#infoPokemon").html("<div class='alert alert-danger' role='alert'>¡Hubo un error al buscar el Pokémon!</div>");
                }
            }
        })
    })
})
