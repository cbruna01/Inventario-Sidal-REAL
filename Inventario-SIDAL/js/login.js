firebase.auth().onAuthStateChanged(function(user) {

  if (user) {
    window.location.href = "agroquimicos.html";
  }   
});

if (localStorage.getItem('admin') == 'true' || localStorage.getItem('operario') == 'true') {
    window.location.href = "agroquimicos.html";
}


function login() {

	var userEmail = document.getElementById("login-email").value;
	var userPass = document.getElementById('login-password').value;
	var loader = document.getElementById('loader');
	loader.style.display = "block";

 	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
	  loader.style.display = "none";
    localStorage.setItem("operario", 'true');
	}).catch(function(error) {
	  loader.style.display = "none";
	  alertify.set('notifier','position', 'top-center');
      alertify.error('Email y/o contraseña incorrecto');
	});
}

function mostrarInputAdmin() {
	var inputAdmin = document.getElementById("admin-user");
	var inputNormal = document.getElementById("normal-user");
	inputAdmin.style.display = "block";
	inputNormal.style.display = "none";

}

function loginAdmin() {
	var codigoAdmin = document.getElementById("input-admin-password").value;

	if(codigoAdmin !== "admin") {
      alertify.set('notifier','position', 'top-center');
      alertify.error('SuperClave incorrecta');
      return;
	}

	var userEmail = document.getElementById("login-email").value;
	var userPass = document.getElementById('login-password').value;
	var loader = document.getElementById('loader');
	loader.style.display = "block";

 	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function() {
	  loader.style.display = "none";
	  localStorage.setItem("admin", 'true');
	}).catch(function(error) {
	  loader.style.display = "none";
	  alertify.set('notifier','position', 'top-center');
      alertify.error('Email y/o contraseña incorrecto');
	});
}
