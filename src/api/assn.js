import request from '@/utils/request'

export function assnList(params) {
  return request({
    url: '/assn/list',
    method: 'get',
    params
  })
}

export function assnNameList(params) {
  return request({
    url: '/assn/nameList',
    method: 'get',
    params
  })
}

export function myHandleAssn() {
  return request({
    url: '/assn/handleAssn',
    method: 'get'
  })
}

export function creatAssn(data) {
  return request({
    url: '/assn/create',
    method: 'post',
    data
  })
}

export function editAssn(data) {
  return request({
    url: '/assn/edit',
    method: 'post',
    data
  })
}

export function disbandAssn(data) {
  return request({
    url: '/assn/disband',
    method: 'post',
    data
  })
}

export function changeHiring(data) {
  return request({
    url: '/assn/changeHiring',
    method: 'post',
    data
  })
}

export function typeList(params) {
  return request({
    url: '/assn/typeList',
    method: 'get',
    // params
  })
}

export function addType(data) {
  return request({
    url: '/assn/addType',
    method: 'post',
    data
  })
}

export function editType(data) {
  return request({
    url: '/assn/editType',
    method: 'post',
    data
  })
}

export function deleteType(data) {
  return request({
    url: '/assn/deleteType',
    method: 'post',
    data
  })
}
