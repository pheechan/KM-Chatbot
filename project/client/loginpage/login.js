document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;
  if(u === "admin" && p === "1234"){
    localStorage.setItem("isLoggedIn","true");
    window.location.href = "../home/index.html";
  } else {
    alert("ชื่อผู้ใช้หรือรหัสผ่านผิด!");
  }
});
