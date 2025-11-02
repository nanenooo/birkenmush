function doGet() {
  var sheetName = "store data"; // Replace with the name of your sheet
  const sheet = SpreadsheetApp.getActiveSheet();(sheetName);

  if (!sheet) {
    return {
      error: "Sheet not found."
    };
  }

  var data = sheet.getDataRange().getValues();
  var jsonData = [];

  let last_temp = 0
  let last_humid = 0
  let temp_avg = 0
  let humid_avg = 0
  let temp_max = 0
  let humid_max = 0
  let temp_min = 0
  let humid_min = 0
  let temp_cnt = 0

  for (var i = 1; i < data.length; i++) {
    let row = data[i]
    let curr_temp = Number(row[2])
    let curr_humid = Number(row[3])

    if (i == 1) {
      temp_max = curr_temp
      temp_min = curr_temp
      humid_max = curr_humid
      humid_min = curr_humid
    } else {
      if (curr_temp >= temp_max) {
        temp_max = curr_temp
      } else if (curr_temp <= temp_min) {
        temp_min = curr_temp
      }
      
      if (curr_humid >= humid_max) {
        humid_max = curr_humid
      } else if (curr_humid <= humid_min) {
        humid_min = curr_humid
      }
    }

    temp_avg += curr_temp
    humid_avg += curr_humid
    temp_cnt += 1
    
    if (i == data.length - 1) {
      last_temp = curr_temp
      last_humid = curr_humid
    }
  }

  temp_avg /= temp_cnt
  humid_avg /= temp_cnt

  jsonData.push(last_temp)
  jsonData.push(last_humid)
  jsonData.push(temp_avg)
  jsonData.push(temp_max)
  jsonData.push(temp_min)
  jsonData.push(humid_avg)
  jsonData.push(humid_max)
  jsonData.push(humid_min)

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
function myFunction() {
doGet();  
}