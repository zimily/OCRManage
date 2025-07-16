import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getMaterialPlatformToken } from '@/utils/auth'

// create an axios instance  创建axios实例、
const service = axios.create({
    //物资平台接口
    // baseURL: '',
    timeout: 5000 // request timeout
})

// request interceptor  request拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['access_token'] = getMaterialPlatformToken()
        }
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

service.interceptors.response.use(

    response => {
        const res = response.data
        // console.log('w测试', res, res.code)

        if (res.code !== 0) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
