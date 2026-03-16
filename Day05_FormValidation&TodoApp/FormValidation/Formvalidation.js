

const ValidateForm = () =>{

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("pnumber").value;
    let pass = document.getElementById("pass").value;
    let cpass = document.getElementById("cpass").value;

    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("phoneError").innerText = "";
    document.getElementById("passError").innerText = "";
    document.getElementById("cpassError").innerText = "";

    let valid = true;

    if(name === "")
    {
        document.getElementById("nameError").innerText = "Name is Required";
        valid = false;
    }
    else if(name <= 5 )
    {
        document.getElementById("nameError").innerText = "Name Must Greater Than 5 characters";
        valid = false;
    }

    if(email === "")
    {
        document.getElementById("emailError").innerText = "Email is Required";
        valid = false;
    }
    if(phone.length !== 10)
    {
        document.getElementById("phoneError").innerText = "Phone Number must be 10 digits";
        valid = false;
    }
    if(pass.length < 6)
    {
        document.getElementById("passError").innerText = "Password Must be at least 6 characters";
        valid = false;
    }
    if(cpass !== pass)
    {
        document.getElementById("cpassError").innerText = "Password and Confirm Password Should be same";
        valid = false;
    }

    return valid;
}