import request from '@/utils/request'

export function myAssn() {
  return request({
    url: '/assnMember/myAssn',
    method: 'get'
  })
}

export function memberSex(params) {
  return request({
    url: '/assnMember/assnSex',
    method: 'get',
    params
  })
}

export function memberCount(params) {
  return request({
    url: '/assnMember/assnCount',
    method: 'get',
    params
  })
}

export function createAssnMember(data) {
  return request({
    url: '/assnMember/create',
    method: 'post',
    data
  })
}

export function editAssnMember(data) {
  return request({
    url: '/assnMember/edit',
    method: 'post',
    data
  })
}

export function disbandAssnMember(data) {
  return request({
    url: '/assnMember/disband',
    method: 'post',
    data
  })
}
