const role1_data=require('./data/role1.json');
const role2_data=require('./data/role2.json');
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MzI2MTc1MDIsInVzZXJuYW1lIjoiYWRtaW4ifQ.nouK_2cxjT4vvJB0tUO-1XKtyz9Z2D9_JkG3LkxPirQ'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login 接口
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {    //请求返回的数据
      const { token } = config.query
      const info = users[token]
      console.log('请求传递的用户信息',info)
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // get user permissions based on role
  {
    url: '/vue-admin-template/user/permission',
    type: 'get',
    response: config => {
      const { role } = config.query

      // 根据 role 返回不同的数据
      let permissions
      if (role === 'role1') {
        permissions = role1_data
      } else if (role === 'role2') {
        permissions = role2_data
      } else {
        permissions = ['null role']
      }

      return {
        code: 20000,
        data: {
          role,
          permissions
        }
      }
    }
  }
]
