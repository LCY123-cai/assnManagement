import request from '@/utils/request'

export function getList(params,url) {
  return request({
    url: url,
    method: 'get',
    params
  })
}