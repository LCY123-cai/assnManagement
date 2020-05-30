import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const state = {
  token: getToken(),
  name: '',
  // 给一个默认的头像
  avatar: '',
  roles: [],
  userId: '',
  assnIds: [],
  assnNames: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_ASSNIDS: (state, assnIds) => {
    state.assnIds = assnIds
  },
  SET_ASSNNAMES: (state, assnNames) => {
    state.assnNames = assnNames
  }
}

const actions = {
  // 用户登录
  login({
    commit
  }, userInfo) {
    const {
      account,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        userAccount: account.trim(),
        userPassword: password
      }).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data)
        // 自定义函数设置cookie,登录成功后将token存储在cookie之中
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const {
          data
        } = response
        if (!data.length) {
          reject('验证失败, 请重新登录.')
        }
        
        const {
          userName: name,
          userImg: avatar,
          userId: userId,
          assnId,
          assnName
        } = data[0]
        let roles = []
        for (const e of data) {
          roles.push(e.roleName)
        }
        // 用户必须是一个非空数组
        if (!roles || roles.length <= 0) {
          reject('getInfo: 角色必须是非空数组!')
        }
        const assnIds = Boolean(assnId) ? assnId.split(',') : []
        const assnNames = Boolean(assnName) ? assnName.split(',') : []
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERID', userId)
        commit('SET_ASSNIDS', assnIds)
        commit('SET_ASSNNAMES', assnNames)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户注销
  logout({
    commit,
    state
  }) {
    // return new Promise((resolve, reject) => {
    // logout(state.token).then(() => {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    // resolve()
    // }).catch(error => {
    // reject(error)
    // })
    // })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
