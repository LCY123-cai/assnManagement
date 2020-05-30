import request from '@/utils/request'

export function issueArticle(data) {
  return request({
    url: '/article/issue',
    method: 'post',
    data
  })
}

export function clickArticle(data) {
  return request({
    url: '/article/clicks',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/article/delete',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function articleImage(data) {
  return request({
    url: '/article/image',
    method: 'post',
    data
  })
}

export function articleList(params) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  })
}




