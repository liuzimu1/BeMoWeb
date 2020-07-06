'use strict';

function checkLoginInfo(e) {
	e.preventDefault();

	const data = {
		adminId: document.querySelector('#userEmail').value,
		password: document.querySelector('#userPassword').value
	}

    const request = new Request('/login/login', {
        method: 'post',
        body: JSON.stringify(data),

        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    })

    fetch(request).then((res) => {
    	console.log(res)
    }).catch((error) => {
        console.log(error)
    })
}