import request from '@/utils/request'

export function excelExport(params, url) {
  return request({
    header: {
      'Content-Type': 'application/xlsx'
    },
    responseType: 'blob',
    method: 'get',
    url: url,
    params
  })
}
