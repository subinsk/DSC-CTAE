// Creating modal
let modalBtn = document.getElementById("modal-btn");
let modal = document.querySelector(".modal");
let closeBtn = document.querySelector(".close-btn");

modalBtn.onclick = function () {
  let message = document.getElementById('message');
  message.style.display = 'none';
  modal.style.display = "flex";
};

closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Adding values in session storage
sessionStorage.setItem('name',document.getElementById('name').value);
sessionStorage.setItem('email',document.getElementById('email').value);
sessionStorage.setItem('username',document.getElementById('username').value);

// Validating form data
let form = document.getElementById("UpdateProfileForm");

form.addEventListener('submit', (event)=>{
  event.preventDefault();
  let formName = document.getElementById('name').value;
  let formUsername = document.getElementById('username').value;
  let formEmail = document.getElementById('email').value;
  let formGender = document.getElementById('gender').value;
  let formMobileno = document.getElementById('mobileno').value;
  let formDob = document.getElementById('dob').value;
  let formPassword = document.getElementById('password').value;
  let formPassword2 = document.getElementById('password2').value;

  let errors=[];

  // Check required
  if(!formName || !formUsername || !formEmail || !formPassword || !formPassword2){
    errors.push({ msg: "Please fill in all fields"});
  }

  // Check passwords match
  if(formPassword !== formPassword2){
    errors.push({ msg:'Passwords do not match'})
  }

  // Check pass length
  if(formPassword.length<6){
    errors.push({ msg: 'Password should be at least 6 characteres'});
  }

  if(errors.length > 0){
    let message = document.getElementById('message');
    message.style.display='block';
    message.style.backgroundColor = 'rgb(202, 163, 163)';
    message.style.border = '2px solid rgb(212, 67, 67)';
    document.querySelector('#message ul').style.color = 'rgb(212, 67, 67)';
    let message_list=message.children;
    message_list[0].innerHTML='';
    errors.forEach((i)=>{
      message_list[0].innerHTML+='<li>'+i['msg']+'</li>';
    });
  }

  else{
    if(formEmail!=sessionStorage.getItem('email') && formUsername!=sessionStorage.getItem('username')){
      if (window.XMLHttpRequest) {
        // code for modern browsers
        var httpRequest = new XMLHttpRequest();
      } 
      else {
        // code for old IE browsers
        var httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      }

      httpRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let error = this.responseText;
          if(error!=''){
            let message = document.getElementById('message');
            message.style.display='block';
            message.style.backgroundColor = 'rgb(202, 163, 163)';
            message.style.border = '2px solid rgb(212, 67, 67)';
            document.querySelector('#message ul').style.color = 'rgb(212, 67, 67)';
            let message_list=message.children;
            message_list[0].innerHTML='<li>'+error+'</li>';
          }
          else{
            formSubmit(formName, formUsername, formEmail, formGender, formMobileno, formDob, formPassword);
          }
        }
      }

      httpRequest.open('POST','/checkfields?t='+Math.random(),true);
      httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpRequest.send(`email=${formEmail}&username=${formUsername}`);
    }
    else{
      formSubmit(formName, formUsername, formEmail, formGender, formMobileno, formDob, formPassword);
    }
  }
});

function formSubmit(name, username, email, gender, mobileno, dob, password){
  if (window.XMLHttpRequest) {
    // code for modern browsers
    var httpRequest2 = new XMLHttpRequest();
  } 
  else {
    // code for old IE browsers
    var httpRequest2 = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let msg = this.responseText;
        let message = document.getElementById('message');
        message.style.display = 'block';
        message.style.backgroundColor = 'rgb(161, 238, 146)';
        message.style.border = '2px solid rgb(61, 155, 42)';
        document.querySelector('#message ul').style.color = 'rgb(61, 155, 42)';
        let message_list=message.children;
        message_list[0].innerHTML='<li>'+msg+'</li>';

        // Updating Session storage variables
        sessionStorage.setItem('name',document.getElementById('name').value);
        sessionStorage.setItem('email',document.getElementById('email').value);
        sessionStorage.setItem('username',document.getElementById('username').value);

    }
  }

  httpRequest2.open('POST','/dashboard',true);
  httpRequest2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest2.send(`name=${name}&username=${username}&email=${email}&gender=${gender}&mobileno=${mobileno}&dob=${dob}&password=${password}`);
}



// Showing Profile Pic 
let profilePic = document.getElementById('profilepic');
profilePic.addEventListener('input', event => {
  let typeOfFile = event.target.files[0].type
  if(typeOfFile=='image/jpeg' || typeOfFile=='image/png' || typeOfFile=='image/jpg'){
    let form = document.getElementById('UpdateProfilePic');
    form.submit();
  }
  else{
    let message = document.getElementById('message');
    message.style.display='block';
    message.style.backgroundColor = 'rgb(202, 163, 163)';
    message.style.border = '2px solid rgb(212, 67, 67)';
    document.querySelector('#message ul').style.color = 'rgb(212, 67, 67)';
    let message_list=message.children;
    message_list[0].innerHTML='<li> Invalid file type. Please enter a jpg or png file. </li>';
  }
});