import request from '@/utils/request'

export function applicationCount(params) {
  return request({
    url: '/application/count',
    method: 'get',
    params
  })
}

export function applicationList(params) {
  return request({
    url: '/application/list',
    method: 'get',
    params
  })
}

export function apply(data) {
  return request({
    url: '/application/apply',
    method: 'post',
    data
  })
}

export function deleteApplication(data) {
  return request({
    url: '/application/delete',
    method: 'post',
    data
  })
}

export function handleApplication(data) {
  return request({
    url: '/application/handle',
    method: 'post',
    data
  })
}

