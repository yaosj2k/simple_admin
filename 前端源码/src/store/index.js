import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getinfo } from '~/api/manager'
import { setToken, removeToken } from '~/composables/auth'

export const useUserStore = defineStore('user', () => {
    // 用户信息
    const user = ref({})

    // 侧边宽度
    const asideWidth = ref('250px')

    // 菜单
    const menus = ref([])

    // 规则名称
    const ruleNames = ref([])

    // 记录用户信息
    function setUserInfo(userInfo) {
        user.value = userInfo
    }

    // 展开/缩起侧边
    function handleAsideWidth() {
        asideWidth.value = asideWidth.value === '250px' ? '64px' : '250px'
    }

    // 设置菜单
    function setMenus(menusList) {
        menus.value = menusList   // 用于将传入的 menusList 参数赋值给 menus 状态。
    }

    // 设置规则名称
    function setRuleNames(ruleNamesList) {
        ruleNames.value = ruleNamesList
    }

    // 登录
    async function loginUser({ username, password }) {
        try {
            const res = await login(username, password)
            setToken(res.token)
            return res
        } catch (err) {
            throw err
        }
    }

    // 获取当前登录用户信息
    async function fetchUserInfo() {
        try {
            const res = await getinfo()
            setUserInfo(res)
            setMenus(res.menus)
            setRuleNames(res.ruleNames)
            return res
        } catch (err) {
            throw err
        }
    }

    // 退出登录
    function logoutUser() {
        // 移除cookie里的token
        removeToken()
        // 清除当前用户状态
        setUserInfo({})
    }

    return {
        user,
        asideWidth,
        menus,
        ruleNames,
        setUserInfo,
        handleAsideWidth,
        setMenus,
        setRuleNames,
        loginUser,
        fetchUserInfo,
        logoutUser
    }
})