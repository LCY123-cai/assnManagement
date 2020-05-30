import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(show=true) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { show }
  })
}

export function editInfo(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function changePaswword(data) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 暂时不需要这个方法，因为前端控制登录信息
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
