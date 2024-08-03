$(document).ready(function() {
    // Selección de elementos
    const $input = $('#buscador');
    const $errorMessage = $('#errorMessage');
    const $button = $('#btn-buscar');
    const $card = $('.card'); 
    const $chartContainer = $('#chartContainer'); 
    const $powerstatsContainer = $('#powerstatsContainer'); 

    // validar que el número esté en el rango 
    function isValidNumber(value) {
        const number = parseInt(value, 10);
        return Number.isInteger(number) && number >= 1 && number <= 732;
    }

    //  entrada del usuario
    $input.on('input', function() {
        if (!isValidNumber($input.val())) {
            $errorMessage.show(); // mensaje de error
            $card.hide(); // Oculta la tarjeta número no es válido
            $chartContainer.hide(); // Oculta  gráfico  número no es válido
        } else {
            $errorMessage.hide(); 
            $card.hide(); // Oculta la tarjeta inicialmente
            $chartContainer.hide(); // Oculta el gráfico inicialmente
        }
    });

    // Maneja el clic en el botón de búsqueda
    $button.on('click', function(event) {
        if (!isValidNumber($input.val())) {
            event.preventDefault();
            $errorMessage.show(); // mensaje de error
            $card.hide(); 
            $chartContainer.hide(); 
        } else {
            $errorMessage.hide(); // Oculta el mensaje de error si el número es válido
            const heroId = $input.val(); // Obtiene el ID del superhéroe ingresado
            const settings = {
                "async": true,
                "crossDomain": true,
                "url": `https://www.superheroapi.com/api.php/4541eee7c35e39f40aa6798176ac2ff0/${heroId}`,
                "method": "GET",
                "headers": {
                    "Accept": "*/*",
                }
            };

            //  solicitud a la API
            $.ajax(settings).done(function(response) {
                console.log(response);

                // Mostrar los datos del superhéroe en la tarjeta
                $('#superImagen').attr('src', response.image.url);
                $('#superNombre').text(response.name);
                $('#superConexiones').text(response.connections['group-affiliation']);
                $('#superPublicado').text(response.biography.publisher);
                $('#superOcupacion').text(response.work.occupation);
                $('#superAltura').text(response.appearance.height[1]);
                $('#superPeso').text(response.appearance.weight[1]);
                $('#superAlianzas').text(response.biography.aliases.join(', '));

                // Mostrar los powerstats en el contenedor
                const powerstats = response.powerstats;
                let powerstatsHtml = `
                    <h5 class="text-center">PowerStats del SuperHero</h5>
                    <ul class="list-group">
                        <li class="list-group-item">Inteligencia: ${powerstats.intelligence || 'Sin información'}</li>
                        <li class="list-group-item">Fuerza: ${powerstats.strength || 'Sin información'}</li>
                        <li class="list-group-item">Velocidad: ${powerstats.speed || 'Sin información'}</li>
                        <li class="list-group-item">Durabilidad: ${powerstats.durability || 'Sin información'}</li>
                        <li class="list-group-item">Poder: ${powerstats.power || 'Sin información'}</li>
                        <li class="list-group-item">Combate: ${powerstats.combat || 'Sin información'}</li>
                    </ul>
                `;
                $powerstatsContainer.html(powerstatsHtml);

                // Filtrar los powerstats con datos válidos
                const dataPoints = [
                    { y: powerstats.intelligence || 0, label: "Inteligencia" },
                    { y: powerstats.strength || 0, label: "Fuerza" },
                    { y: powerstats.speed || 0, label: "Velocidad" },
                    { y: powerstats.durability || 0, label: "Durabilidad" },
                    { y: powerstats.power || 0, label: "Poder" },
                    { y: powerstats.combat || 0, label: "Combate" }
                ].filter(point => point.y > 0); // Elimina los puntos con valor 0

                // Crear el gráfico solo si hay puntos de datos válidos
                if (dataPoints.length > 0) {
                    var chart = new CanvasJS.Chart("chartContainer", {
                        theme: "light2",
                        exportEnabled: true,
                        animationEnabled: true,
                        title: {
                            text: `Estadísticas de Poder para ${response.name}`
                        },
                        data: [{
                            type: "pie",
                            startAngle: 25,
                            toolTipContent: "<b>{label}</b>: {y}%",
                            showInLegend: "true",
                            legendText: "{label}",
                            indexLabelFontSize: 16,
                            indexLabel: "{label} - {y}%",
                            dataPoints: dataPoints
                        }]
                    });
                    chart.render();
                    $chartContainer.show(); 
                } else {
                    $chartContainer.hide(); 
                }

                // Mostrar la tarjeta después de que se haya cargado la información del superhéroe
                $card.show();
            });
        }
    });
});
