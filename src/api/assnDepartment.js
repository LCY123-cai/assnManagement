import request from '@/utils/request'

export function departmentList(params) {
  return request({
    url: '/department/list',
    method: 'get',
    params
  })
}

export function creatDepartment(data) {
  return request({
    url: '/department/create',
    method: 'post',
    data
  })
}

export function editDepartment(data) {
  return request({
    url: '/department/edit',
    method: 'post',
    data
  })
}

export function disbandDepartment(data) {
  return request({
    url: '/department/disband',
    method: 'post',
    data
  })
}


