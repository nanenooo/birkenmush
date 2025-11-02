function doGet() {
  var sheetName = "store data"; // Replace with the name of your sheet
  const sheet = SpreadsheetApp.getActiveSheet();(sheetName);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (!sheet) {
    return {
      error: "Sheet not found."
    };
  }

  var data = sheet.getDataRange().getValues();
  var txtData = "";

  for (var i = data.length - 1; i > 1; i--) {
    if (data.length - i > 100) {
      break
    }
    let row = data[i]
    r_date = row[0].getDate() + " " + months[row[0].getMonth()] + " " + row[0].getFullYear()
    r_time = ('0' + row[1].getHours()).slice(-2) + ":" + ('0' + row[1].getMinutes()).slice(-2) + ":" + ('0' + row[1].getSeconds()).slice(-2)
    txtData += (r_date + " " + r_time + " | Temperature: " + row[2] + ", Humidity: " + row[3] + "<br>")
  }

  return ContentService.createTextOutput(txtData)
    .setMimeType(ContentService.MimeType.TEXT);
}
function myFunction() {
  doGet();
}