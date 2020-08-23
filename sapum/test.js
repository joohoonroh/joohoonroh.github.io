var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function doGet(e) {
	return handleResponse(e);
}

function doPost(e) {
	return handleResponse(e);
}

function handleResponse(e) {
	var lock = LockService.getPublicLock();
	lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

	try {
		var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
		var sheet = e.parameter.sheet || doc.getSheets()[0];
		var nextRow = sheet.getLastRow() + 1; // 마지막 행 다음칸
		var target = sheet.getRange(e.parameter.position + (Number(e.parameter.id) + 1));
		var targetValue = target.getValue();
		var func = e.parameter.func.split("self").join(targetValue);

		target.setValue(eval(func));

		// return json success results
		return ContentService
			.createTextOutput(JSON.stringify({
				"result": "success",
			}))
			.setMimeType(ContentService.MimeType.JSON);
	} catch (e) {
		// if error return this
		return ContentService
			.createTextOutput(JSON.stringify({"result": "error", "error": e}))
			.setMimeType(ContentService.MimeType.JSON);
	} finally { //release lock
		lock.releaseLock();
	}
}

function setup() {
	var doc = SpreadsheetApp.getActiveSpreadsheet();
	SCRIPT_PROP.setProperty("key", doc.getId());
}