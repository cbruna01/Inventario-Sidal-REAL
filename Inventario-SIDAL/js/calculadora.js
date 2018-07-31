
window.onload = inicializar;

//------------------------------- WINDOW ON LOAD ----------------------------------//

if (localStorage.getItem('admin') == null && localStorage.getItem('operario') == null) {
    window.location.href = "index.html";
}
if (localStorage.getItem('admin') == 'false' && localStorage.getItem('operario') == 'false') {
    window.location.href = "index.html";
}

window.onload = inicializar;

//-------------------------------- VARIABLES -------------------------------------//

var botonCerrarSesion;

//------------------------------- INICIALIZAR -----------------------------------//

function inicializar() { 

  if (localStorage.getItem('admin') == 'true') {
      document.getElementById('btn-usuarios').style.display= "inline";
  }

  var botonCerrarSesion = document.getElementById("btn-cerrarSesion");
  botonCerrarSesion.addEventListener("click" , logout, false);
}

//----------------------------- CALCULAR ------------------------------//
function calcular() {
	var dosis = document.getElementById("dosis").value;
	var area = document.getElementById('area').value;

  if (dosis == 0 || area == 0 ) {
    alertify.set('notifier','position', 'top-center');
    alertify.error('Todos los campos son obligatorios', 3);
  } else {
    var litros = (dosis*area)/1000;
    var cm3 = litros*1000;
    document.getElementById('litros').value = litros;
    document.getElementById('cm3').value = cm3;
  }	
}

//----------------------------- LOGOUT --------------------------------//
  function logout() {

    firebase.auth().signOut();
    localStorage.setItem("admin", "false");
    localStorage.setItem("operario", "false");
    window.location.href = "index.html";
  }
