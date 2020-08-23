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
		var headRow = e.parameter.header_row || 1; // 헤더 열 위치 (기본 1)
		var headers = sheet.getRange(headRow, 1, 1, sheet.getLastColumn()).getValues()[0];
		var target = sheet.getRange((Number(e.parameter.id) + 1), nowColumn(e.parameter.name));
		var targetValue = target.getValue();
		var func = e.parameter.func.split("self").join(targetValue);
		var nextRow = sheet.getLastRow() + 1; // 마지막 행 다음칸

		function nowColumn(name) {
			for (var i = 0; i < headers.length; i++) {
				if (headers[i] == name) {
					return i + 1;
				}
			}
		}

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