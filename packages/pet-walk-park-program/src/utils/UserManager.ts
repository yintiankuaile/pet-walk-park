interface UserInfo {
  ennUnifiedAuthorization: string;
  ennUnifiedCsrfToken: string;
}
const KEY = 'user-info';
var userInfo: UserInfo | undefined;

/**
 * 判断登录状态
 * @returns
 */
export const isLogin = () => {
  return Boolean(getUserInfo());
};

export const setUserInfo = (info: UserInfo) => {
  userInfo = info;
  uni.setStorageSync(KEY, JSON.stringify(info));
};

export const getUserInfo = () => {
  if (userInfo) {
    return userInfo;
  }
  const json = uni.getStorageSync(KEY);
  if (json && json.length) {
    userInfo = JSON.parse(json);
  }
  return userInfo;
};

export const cleanUserInfo = () => {
  userInfo = undefined;
  uni.removeStorageSync(KEY);
  uni.removeStorageSync('eid');
  uni.removeStorageSync('ename');
};
