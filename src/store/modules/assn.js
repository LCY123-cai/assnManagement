const state = {
  typeList: []
}

const mutations = {
  changeTypeList(state, typeList) {
    state.typeList = typeList
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
