import moment from 'moment'
export function excelExport(res, name) {
  let blob = new Blob([res], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  });
  let downloadElement = document.createElement("a");
  // 创建下载的链接
  let href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  // 下载后文件名
  downloadElement.download =
    moment().format("YYYY-MM-DD") + `${name}.xlsx`;
  document.body.appendChild(downloadElement);
  // 点击下载
  downloadElement.click();
  // 下载完成移除元素
  document.body.removeChild(downloadElement);
  // 释放掉blob对象
  window.URL.revokeObjectURL(href);
}
