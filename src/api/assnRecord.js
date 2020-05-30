import request from '@/utils/request'

export function recordList(params) {
  return request({
    url: '/assnRecord/user',
    method: 'get',
    params
  })
}



