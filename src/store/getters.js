//根getter  区别于模块getter
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  flag: state => state.user.flag,
  roles: state => state.authority.roles,
  indices:state => state.inspectionDetail.indices,

}
export default getters
