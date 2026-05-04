document.addEventListener("DOMContentLoaded", function () {

    // ===== Cognito Config =====
    const poolData = {
      UserPoolId: "us-east-1_gFzKBoxUE",
      ClientId: "deuj2keprro5a2icvna5ohbg"
    };
  
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  
    // ===== Sign Up =====
    window.signUp = function () {
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      // ===== validation =====
      if (!email.endsWith("@dome.tu.ac.th")) {
        alert("Use only @dome.tu.ac.th email");
        return;
      }
  
      if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("Password not match");
        return;
      }
  
      const btn = document.querySelector("button");
      btn.disabled = true;
  
      const attributeList = [];
  
      const dataEmail = {
        Name: "email",
        Value: email
      };
  
      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
      );
  
      userPool.signUp(email, password, attributeList, null, function(err, result) {
  
        btn.disabled = false;
  
        if (err) {
          console.error(err);
  
          if (err.code === "UsernameExistsException") {
            alert("This email is already registered");
          } else if (err.code === "InvalidPasswordException") {
            alert("Password does not meet requirements");
          } else {
            alert(err.message || "Signup failed");
          }
  
          return;
        }
		
		const userData = {
			email: email,
		    role: "STUDENT", 
		    cognitoSub: result.userSub 
		};

		// ส่งข้อมูลไปที่ Spring Boot Controller
		fetch('/api/auth/sync-user', {
		    method: 'POST',
		    headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(userData)
		})
		.then(response => {
		    if (response.ok) {
		    	alert("Signup success! Check your email for OTP verification");
		        window.location.href = "confirm.html"; // เปลี่ยนหน้าเมื่อบันทึกสำเร็จเท่านั้น
		    } else {
		        alert("Cognito success, but failed to save in local DB");
		    }
		})
		.catch(err => {
		    console.error("Sync Error:", err);
		    alert("Network error while syncing to database");
		});	  
	  });
	};
  });