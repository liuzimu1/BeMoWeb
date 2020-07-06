'use strict';

const allPages = document.querySelector("#adminTable");
allPages.addEventListener('click', modifyPage);

const pageEditForm = document.querySelector("#editPageForm");

var pageInfoList = [];
const pageIdList = {}
var createNewPage = false;
var pageNum = 0;

function PageObj(name, title, bannerUrl) {
	this.name = name;
	this.title = title;
	this.banner = bannerUrl;
}

// server call to get all pages info
function fillInfo() {
	pageInfoList = [];
	pageIdList = {};


}

function displayEditForm(pageName) {
	const generalInfo = pageEditForm.getElementsByClassName('pageGeneralInfo');

	const match = pageList.filter(page => page.name === pageName);
	const targetPage = match[0];

	const pageId = Object.keys(pageIdList).find(key => pageIdList[key] === targetPage.name);

	generalInfo[0].getElementsByTagName('input')[0].value = pageId;
	generalInfo[1].getElementsByTagName('input')[0].value = targetPage.name;
	generalInfo[2].getElementsByTagName('input')[0].value= targetPage.title;
	generalInfo[3].getElementsByTagName('input')[0].value= targetPage.banner;		
}

function modifyPage(e) {
	if (e.target.classList.contains('editPage')) {
		const pageName = e.target.parentElement.parentElement.firstChild.nodeValue;
		displayEditForm(pageName.trim());

		console.log("edit page: ", pageName);
		pageEditForm.style.display = "block";
		window.location.href = "#editPageForm";
	} else if (e.target.classList.contains('addNewPage')) {
		createNewPage = true;
		const title = pageEditForm.getElementsByTagName('h1')[0];
		title.innerText = "Add new page";
		pageEditForm.style.display = "block";
		pageEditForm.getElementById('editTextForm').style.display = "none";
		window.location.href = "#editPageForm";
	} else if (e.target.classList.contains('deletePage')) {
		const pageName = e.target.parentElement.parentElement.firstChild.nodeValue;
		const pageToRemove = e.target.parentElement.parentElement.parentElement;
		pageToRemove.parentElement.removeChild(pageToRemove);

		// Delete page in database
		console.log("remove page: ", pageName);
		deletePage(pageName.trim());
	}
}

function deletePage(pageName) {
	const match = pageList.filter(page => page.name === pageName);
	const targetPage = match[0];

	//delete page info in database
	

}

function updatePage() {
	const generalInfo = pageEditForm.getElementsByClassName('pageGeneralInfo');
	const editTextBlock = pageEditForm.getElementById('editTextForm');
	const newTextBlock = pageEditForm.getElementById('addTextForm');
	const deleteTextBlock = generalInfo[3];

	//update page header info
	const pageId = generalInfo[0].getElementsByTagName('input')[0].value;

	const data = {
		name: generalInfo[1].getElementsByTagName('input')[0].value,
		title: generalInfo[2].getElementsByTagName('input')[0].value,
		banner: generalInfo[3].getElementsByTagName('input')[0].value
	}

	//server call
	patchPage(pageId, data);

}

