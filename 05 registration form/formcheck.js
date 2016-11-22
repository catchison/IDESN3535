function formCheck (registration)

var namecheck = document.registration.customerName;
var custEmail = document.registration.email;
var passid = document.registration.passid;


{  
if ( passidcheck (passid) )
{
if (ValidateEmail (custEmail) )
}
}
  
function custName_check (custName)
{  
var namecheck_len = namecheck.value.length;
if ( namecheck_len == 0 || namecheck_len <= 2 )
{  
alert( 'Full name must be larger than 2 characters.' );
namecheck.focus();
return false;  
}

else
return true;  
}

function passidcheck (passid)
{  
var passid_len = passid.value.length;  
if ( passid_len <= 10 )
{  
alert ( 'Password must be longer than 10 characters and include one number.' );
passid.focus();
return false;  
}

else
return true;  
}


function ValidateEmail (uemail)
{  
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
if(uemail.value.match(mailformat))  
{  
return true;  
}

else  

{  
alert ( 'Thank you for registering!' );
window.location.reload()  
return true;  
}  
}