  //------------------------------- WINDOW ON LOAD ----------------------------------//

  
  if (localStorage.getItem('admin') == null && localStorage.getItem('operario') == null) {

    window.location.href = "index.html";
  }
    
  
  if (localStorage.getItem('admin') == 'false' && localStorage.getItem('operario') == 'false') {
    window.location.href = "index.html";
  }
  
  
  window.onload = inicializar;

  //-------------------------------- VARIABLES -------------------------------------//

  var formDatos, refDatos, tBodyTablaDatos, modal, botonCerrarModal,
      botonAgregar, botonSubmit, CREAR, ACTUALIZAR, modo, botonPDF, botonCerrarSesion;

  //------------------------------- INICIALIZAR -----------------------------------//

  function inicializar() {
    
    if (localStorage.getItem('admin') == 'true') {
      document.getElementById('btn-usuarios').style.display= "inline";
    }    

    modal            = document.getElementById('modal');
    formDatos        = document.getElementById("form-datos");
    tBodyTablaDatos  = document.getElementById("tbody-tabla-datos");
    botonAgregar     = document.getElementById("btn-agregar");
    botonSubmit      = document.getElementById("btn-enviar");
    botonPDF         = document.getElementById("btn-pdf");
    botonCerrarSesion = document.getElementById("btn-cerrarSesion");
    botonCerrarModal = document.getElementsByClassName("close")[0];

    formDatos        .addEventListener("submit", enviarDatosFirebase, false);
    botonCerrarModal .addEventListener("click" , cerrarModal        , false);
    botonAgregar     .addEventListener("click" , mostrarModal       , false);
    botonCerrarSesion.addEventListener("click" , logout             , false);
    //botonPDF         .addEventListener("click" , generarPDF         , false);

    CREAR            = "CREAR";
    ACTUALIZAR       = "ACTUALIZAR";
    modo             =  CREAR;

    window.onclick   = cerrarModalAlClickAfuera;
    refDatos         = firebase.database().ref().child("animales");

    //generarProductos(18);
  }

  //----------------------- CERRAR MODAL AL CLICK AFUERA --------------------------//

  function cerrarModalAlClickAfuera (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("form-datos").reset();        
    }
  }

  //------------------------------ MOSTRAR MODAL ----------------------------------//

  function mostrarModal() {
    botonSubmit.value = (modo == "CREAR") ? "Enviar" : "Actualizar";
    modal.style.display = "block";
  }

  //------------------------------ CERRAR MODAL ----------------------------------//

  function cerrarModal(event) {
    modal.style.display = "none";
    modo = "CREAR";
    document.getElementById("form-datos").reset();    
  }

  //-------------------------- ENVIAR DATOS FIREBASE -----------------------------//

  function enviarDatosFirebase(event) {
    event.preventDefault();

    var datos = [];
    datos[0]  = event.target.nombre.value;    
    datos[1]  = event.target.comida.value;
    datos[2]  = event.target.proteina.value;

    if (modo == CREAR && validarCamposObligatorios(datos) == false) {
      alertify.set('notifier','position', 'top-center');
      alertify.error('Todos los campos son obligatorios', 3);
      return;
    }

    switch (modo) {
      case CREAR:
        refDatos.push({
          nombre      : datos[0], 
          comida      : datos[1], 
          proteina    : datos[2], 
          cantidad    : 0
        } ,function (error) {
            alertify.set('notifier','position', 'bottom-right');
            (error) ? alertify.error("No se pudo agregar el animal") : alertify.success("Agregado con éxito");
        });

        verificarConexion();

        break;
      case ACTUALIZAR:
        refDatoEditar.update({
          nombre      : datos[0], 
          comida      : datos[1], 
          proteina    : datos[2]          
        },function (error) {
          if (error) {
            alertify.error("No se pudo editar el animal");
          }
        });

        var elementosEditables = document.getElementsByClassName("editar");
        for (var i = 0; i < elementosEditables.length; i++) {
          elementosEditables[i].addEventListener("click", editarDato, false);
        }
        var elementosBorrables = document.getElementsByClassName("borrar");
        for (var i = 0; i < elementosBorrables.length; i++) {
          elementosBorrables[i].addEventListener("click", borrarDato, false);
        }
        var elementosAceptables = document.getElementsByClassName("yes");
        for (var i = 0; i < elementosAceptables.length; i++) {
          elementosAceptables[i].addEventListener("click", agregarQuitarElementos, false);
        }

        modo = CREAR;
      break;
    }
    formDatos.reset();
    cerrarModal()
  }

  //------------------------------ EDITAR DATO ----------------------------------//

  function editarDato() {
    var keyDatoEditar = this.getAttribute("data");
    refDatoEditar = refDatos.child(keyDatoEditar);
    console.log(keyDatoEditar);

    refDatoEditar.once("value", function (snap) {
      var datos = snap.val();
      document.getElementById("nombre").value        = datos.nombre;
      document.getElementById("comida").value        = datos.comida;
      document.getElementById("proteina").value      = datos.proteina;
      
    });

    modo = ACTUALIZAR;
    mostrarModal();
  }

  //--------------------------- AGREGAR ELEMENTO ------------------------------//

  function agregarQuitarElementos() {
    var keyDatoEditar = this.getAttribute("data");
    refDatoEditar = refDatos.child(keyDatoEditar);

    if ((document.getElementById(keyDatoEditar + "input-agregar")).value == "") return;

    var cantidadActual;
    var opcion            = opcionElegida( keyDatoEditar + "select-agregar");
    var cantidadModificar = Number((document.getElementById(keyDatoEditar + "input-agregar")).value);    

    firebase.database()
            .ref("animales/" + keyDatoEditar)
            .once('value')
            .then(function(snapshot) {
              cantidadActual = Number((snapshot.val().cantidad));
              if (isNaN(cantidadActual)) {
                cantidadActual = 0;
              }
              if (cantidadModificar > cantidadActual && opcion == "Quitar") {
                alertify.error("No se puede quitar más de " + cantidadActual + " elementos");
              } else {
              var cantidadTotal = (opcion == "Agregar") ? cantidadActual + cantidadModificar
                                                        : cantidadActual - cantidadModificar;                                                        
       if (cantidadTotal == 0) {
        cantidadTotal = "SIN STOCK";        
       }
       refDatoEditar.update({
         cantidad   : cantidadTotal
       } ,function (error) {
         if (error)  alertify.error("No se pudo editar el producto");
       });

       var elementosEditables = document.getElementsByClassName("editar");
       for (var i = 0; i < elementosEditables.length; i++) {
         elementosEditables[i].addEventListener("click", editarDato, false);
       }
       var elementosBorrables = document.getElementsByClassName("borrar");
       for (var i = 0; i < elementosBorrables.length; i++) {
         elementosBorrables[i].addEventListener("click", borrarDato, false);
       }
       var elementosAceptables = document.getElementsByClassName("yes");
       for (var i = 0; i < elementosAceptables.length; i++) {
         elementosAceptables[i].addEventListener("click", agregarQuitarElementos, false);
       }
    }});

  }

  //------------------------------ BORRAR DATO ---------------------------------//

  function borrarDato() {
    if (!confirm("¿Seguro que desea borrar?")) return;

    var keyDatoBorrar = this.getAttribute("data");
    var refDatoBorrar = refDatos.child(keyDatoBorrar);

    console.log(keyDatoBorrar)

    refDatoBorrar.remove()

    var table = $('#tabla-datos').DataTable();
    table
      .row( $(this).parents('tr') )
      .remove()
      .draw(false);
  }

  //--------------------------- VERIFICAR CONEXIÓN ------------------------------//

  function verificarConexion() {
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === false) {
        alertify.set('notifier','position', 'bottom-right');
        alertify.error('ERROR: No hay conexión con base de datos', 2);
      }
    });
  }

  //------------------- VALIDAR QUE ESTÉN TODOS LOS DATOS ----------------------//

  function validarCamposObligatorios(datos) {
    var validador = true;
    for (var i = 0; i < datos.length; i++) {
      if (datos[i] == "") {
        validador = false;
        break;
      }
    }
    return validador;
  }

  //-------------------- OBTENER VALOR DE OPCIÓN ELEGIDA -----------------------//

  function opcionElegida(id) {
    var elt = document.getElementById(id);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
  }

  //--------------------------- GENERAR PRODUCTOS ------------------------------//

  function generarProductos(cantidad) {
    var nombresProductos = ["Afalon", "Asulox","Basta","Betanal","Brodal","Cobex","Cobra","Digital","Diuron","Furore","Galtac","Hussar","Iloxan","Isomero","Liberty","Logico","Merlin","Rango","Staric","Premerge","Prilan"];

    for (var i = 0; i < (cantidad > cantidad.length) ? cantidad.length : cantidad; i++) {
      var compuesto = (Math.floor((Math.random() * 2) + 1) == 1) ? "Glifosato" : "Glufosinato";
      var control   = (Math.floor((Math.random() * 2) + 1) == 1) ? "Herbicida" : "Fertilizante foliar";
      var formato   = (Math.floor((Math.random() * 2) + 1) == 1) ? "Líquido" : "Compuesto Dispersable";
      var cantidad  = Math.floor((Math.random() * 10) + 1);
      var nombre    = nombresProductos[i];

      refDatos.push({
        nombre          : nombre             , compuesto    : compuesto , formato : formato   ,
        control         : control            , presentacion : i + 3     , dosis   : i + 0.1   ,
        recomendaciones : (i + 1) + " litros", cantidad     : cantidad
      });
    }
  }

  //----------------------------- GENERAR PDF --------------------------------//
  //TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO//

  function generarPDF() {
    var doc = new jsPDF();
    doc.fromHTML($('#tabla-datos').get(0), 20, 20, {width: 500});
    doc.save('Hola.pdf');
  }

  //----------------------------- LOGOUT --------------------------------//
  function logout() {

    firebase.auth().signOut();
    localStorage.setItem("admin", "false");
    localStorage.setItem("operario", "false");
    window.location.href = "index.html";
  }
