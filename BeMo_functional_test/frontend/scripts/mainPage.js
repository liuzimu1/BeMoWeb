'use strict';

fillMainPage();

const pageEditForm = document.querySelector("#editPageForm");
const textEditForm = document.querySelector("#changeTextForm");
const content = document.querySelector("#contentText");

const mainPageInfo = {};

var createNewPage = false;
var changeText = false;
var deleteText = false;
var addText = false;

function fillMainPage() {
	//fill in header content
	fetch('/mainInfo', { method: 'get' }).then(res => {
		if (res.statusCode == 404) {
			const data = {
				name: "Main",
				title: "FREE Ultimate Guide to CDA Interviews: Tips & Proven Strategies to Help You Prepare & Ace Your CDA Structured Interview.",
				banner: "https://cdainterview.com/resources/cda-interview-guide.jpg"
			}
		    const req = new Request('/newPage', {
		        method: 'post',
		        body: JSON.stringify(data),
		        headers: {
		            'Accept': 'application/json, text/plain, */*',
		            'Content-Type': 'application/json'
		        }
		    })	
		    fetch(req).then((res) => {
		        console.log(res);
		        if (res.statusCode == 200) {
					res.clone().json().then(page => {
						fillMainHeader(page);
					})		        	
		        }
		    }).catch((error) => {
		        console.log(error)
		    })				
		} else if (res.statusCode == 200) {
			res.clone().json().then(page => {
				fillMainHeader(page);
			})			
		}

	}).catch((error) => {console.log(error)})

	//check if admin user
	fetch('/currAdminUser',{ method: 'get' }).then(response => {
		console.log(response);
		response.clone().json().then((userId) => {
			console.log("Current admin user is: ", userId);
			if (userId === "admin01") {
				document.getElementById('editPageButton').style.display = "block";
				document.getElementById('editTextButton').style.display = "block";
				document.getElementById('deleteTextButton').style.display = "block";
				document.getElementById('newTextButton').style.display = "block";
			} else {
				document.getElementById('editPageButton').style.display = "none";
				document.getElementById('editTextButton').style.display = "none";
				document.getElementById('deleteTextButton').style.display = "none";
				document.getElementById('newTextButton').style.display = "none";
			}			
		})
	}).catch((error) => {console.log(error)})
}

function fillMainHeader(page) {
	mainPageInfo.id = page._id;
	mainPageInfo.title = page.metaTitle;
	mainPageInfo.name = page.name;
	mainPageInfo.description = page.metaDescription;
	mainPageInfo.banner = page.bannerImg;
	//set meta title
	document.title = page.metaTitle;
	//set page name in navbar
	document.getElementById('current').innerText = page.name;
	//set meta description
	const metas = document.getElementsByTagName('meta');
	for (let i = 0; i < metas.length; i++) {
		if (metas[i].getAttribute('name') === 'description') {
			metas[i].setAttribute("content", page.metaDescription);
		}
	}
	//set banner image
	document.getElementsByTagName('img')[1].setAttribute('src', page.bannerImg);	
}

function displayEditForm() {
	const generalInfo = pageEditForm.getElementsByClassName('pageGeneralInfo');

	generalInfo[0].getElementsByTagName('input')[0].value = mainPageInfo.name;
	generalInfo[1].getElementsByTagName('input')[0].value= mainPageInfo.title;
	generalInfo[2].getElementsByTagName('input')[0].value= mainPageInfo.banner;		

	pageEditForm.style.display = "block";
	document.getElementById('editPageForm').style.display = "block";
	document.getElementById('addTextForm').style.display = "none";	
	window.location.href = "#editPageForm";	
}


function displayEditText() {
	changeText = true;
	textEditForm.style.display = "block";
	document.getElementById('editTextForm').style.display = "block";
	document.getElementById('addTextForm').style.display = "none";
	textEditForm.getElementsByClassName('pageGeneralInfo')[0].style.display = "none";
	window.location.href = "#changeTextForm";
}

function displayAddText() {
	addText = true;
	textEditForm.style.display = "block";
	document.getElementById('addTextForm').style.display = "block";
	document.getElementById('editTextForm').style.display = "none";
	textEditForm.getElementsByClassName('pageGeneralInfo')[0].style.display = "none";
	window.location.href = "#changeTextForm";	
}

function displayDeleteText() {
	deleteText = true;
	textEditForm.style.display = "block";
	textEditForm.getElementsByClassName('pageGeneralInfo')[0].style.display = "block";
	document.getElementById('editTextForm').style.display = "none";
	document.getElementById('addTextForm').style.display = "none";
	window.location.href = "#changeTextForm";	
}

function updateText() {
	if (changeText) {
		const info = document.getElementById('editTextForm');
		const block_num = info.getElementsByTagName('input')[0].value;
		const font_fam = info.getElementsByTagName('input')[1].value;
		const font_sz = info.getElementsByTagName('input')[2].value;
		const font_weight = info.getElementsByTagName('input')[4].value;
		const color = info.getElementsByTagName('input')[3].value;
		const text_style = `font:${font_sz}, ${font_fam}; font-weight:${font_weight}; color: ${color};`;

		const block = content.getElementsByTagName('span')[block_num];


		console.log("update text block: ", block_num);
		if (block_num >= 0 && block_num < content.getElementsByTagName('span').length) {
			block.setAttribute('style', text_style);
			block.innerHTML = info.getElementsByClassName('newTextContent')[0].value;		
		}

		changeText = false;

	} else if (addText) {
		const info = document.getElementById('addTextForm');
		const font_fam = info.getElementsByTagName('input')[0].value;
		const font_sz = info.getElementsByTagName('input')[1].value;
		const font_weight = info.getElementsByTagName('input')[3].value;
		const color = info.getElementsByTagName('input')[2].value;

		const newBlock = document.createElement('span');

		newBlock.setAttribute('style', text_style);
		newBlock.innerHTML = info.getElementsByClassName('newTextContent')[0].value;

		content.appendChild(newBlock);

		addText = false;
	} else if (deleteText) {
		
		const info = textEditForm.getElementsByClassName('pageGeneralInfo')[0];
		const block_num = info.getElementsByTagName('input')[0].value;

		const block = content.getElementsByTagName('span')[block_num];

		console.log("delete text block: ", block_num);
		if (block_num >= 0 && block_num < content.getElementsByTagName('span').length) {
			block.parentElement.removeChild(block);
		}

		deleteText = false;
	}

	textEditForm.style.display = "none";
	window.location.href = "#contentText";	
}

function updatePageInfo() {
	const generalInfo = pageEditForm.getElementsByClassName('pageGeneralInfo');
	//update page header info
	const data = {
		name: generalInfo[1].getElementsByTagName('input')[0].value,
		title: generalInfo[2].getElementsByTagName('input')[0].value,
		banner: generalInfo[3].getElementsByTagName('input')[0].value
	}

	//server call
	const xhr = new XMLHttpRequest();

	xhr.open("PATCH", '/mainPage');
	xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Successfully update main page!")
        } else {
            console.error(xhr.statusText)
        }
    }


    xhr.send(JSON.stringify(data));
}


function saveChange() {
	updatePageInfo();

	fillMainPage();
	userEditForm.style.display = 'none';
	window.location.reload();
}

