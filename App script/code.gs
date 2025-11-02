const API_KEY = 'ohmlnwza';

function doGet(e) {
  const key = e.parameter.key;
  if (key !== API_KEY) return out({ ok:false, error:'unauthorized' });

  const temp = Number(e.parameter.temp);
  const moi  = Number(e.parameter.moi);
  if (!isFinite(temp) || !isFinite(moi)) return out({ ok:false, error:'bad_params' });

  const now = new Date();
  const timeTH = Utilities.formatDate(now, 'Asia/Bangkok', 'HH:mm:ss');
  const dateTH = Utilities.formatDate(now, 'Asia/Bangkok', 'm/d/yyyy');

  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange('A:A').setNumberFormat('m/d/yyyy'); // date+time
  sheet.getRange('B:B').setNumberFormat('HH:mm');       // time
  sheet.getRange('C:D').setNumberFormat('0.0');            // temp/humidity เป็นตัวเลขทศนิยม 1 ตำแหน่ง

  // (ถ้ายังไม่มีหัวตาราง ใส่ให้ด้วย—ไม่บังคับ)
  if (sheet.getLastRow() === 0) sheet.appendRow(['date','time','temp','humidity']);

  sheet.appendRow([now, timeTH, temp, moi]);
  return out({ ok:true });
}

function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}