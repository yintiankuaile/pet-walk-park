import { getUserInfo, cleanUserInfo } from './UserManager';

interface ZRequest {
	url : string;
	data ?: any;
	method ?: 'POST' | 'GET' | 'PUT' | 'OPTIONS' | 'HEAD' | 'DELETE' | 'TRACE' | 'CONNECT';
	header ?: { [key : string] : string };
	responseType ?: UniNamespace.RequestOptions['responseType'];
}
interface ZResponse<T> {
	code : string;
	data ?: T;
	message : string;
}
const KEY = 'eid';
const AUTH_STATUS_MSG_MAP: any = {
	// 401: '缺少角色或资源权限，无法访问',
	403: 'CSRF token校验失败',
	408: '请求用户中心超时',
	417: '缺少token，无法访问',
	418: 'token签名、格式、有效期等校验失败，无法访问',
	420: '当前账号已在别处登录，当前登录失效，请您重新登录',
	421: 'grantCode已过期',
	422: '缺少grantCode',
};
// const baseUrl = 'http://116.198.247.204:3000'; // 云服务ip地址
const baseUrl = 'http://192.168.183.174:3000'; // 如果后端是本期启动，这个是本地ip地址

const relogin = (code : number) => {
	uni.showModal({
		title: '登录失效',
		content: AUTH_STATUS_MSG_MAP[code],
		showCancel: false,
		confirmColor: '#ED5832',
		confirmText: '好的',
		success: res => {
			if (res.confirm) {
				//*清空缓存重新登录
				cleanUserInfo();
				uni.navigateTo({
					url: '/pages/Login/index',
				});
			}
		},
	});
};
const getRequestHeader = (header : ZRequest['header']) => {
	const userInfo = getUserInfo();
	const eid = uni.getStorageSync(KEY);
	return userInfo
		? {
			...header,
			'X-Eid': eid ? eid : '',
			EnnUnifiedAuthorization: userInfo?.ennUnifiedAuthorization,
			EnnUnifiedCsrfToken: userInfo?.ennUnifiedCsrfToken,
		}
		: header;
};
const getUrl = (url : string) => {
	if (url.startsWith('http')) {
		return url;
	}
	return baseUrl + url;
};

const handleSuccess = async function <T>(response : UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult, arg ?: any) : Promise<[any, ZResponse<R> | null]> {
	const handleError = (msg : string, response ?: ZResponse<T>) : [any, null] => {
		uni.showToast({
			title: msg,
			icon: 'error',
			duration: 3000,
		});
		return [{ message: msg, response }, null];
	};
	const { statusCode, data: res } = response;
	if (statusCode === 500) {
		return handleError('系统繁忙，请稍后再试', res as ZResponse<T>);
	}
	if (statusCode === 503) {
		return handleError('网络异常', res as ZResponse<T>);
	}
	if (statusCode === 401) {
		return handleError('缺少角色或资源权限，无法访问', res as ZResponse<T>);
	}
	if (
		Object.keys(AUTH_STATUS_MSG_MAP)
			.map(v => Number(v))
			.includes(statusCode)

	) {
		// 登录失效
		relogin(statusCode);
		return [{ message: 'error', response }, null];
	}

	if (statusCode === 200) {
		const { code, message } = res as ZResponse<T>;
		if (code === '0') {
			// 成功直接返回promise
			return [null, res as ZResponse<T>];
		}
		if (parseInt(code) < 0) {
			return handleError(message || '出错了', res as ZResponse<T>);
		}
	}
	return [{ message: 'error', response }, null];
};

/**
 *
 * @param url
 * @param data
 * @param  method {"POST|GET默认值POST"}
 * @returns
 */
const uniRequest = function ({ url = '', data = {}, method = 'POST', responseType, header = {} } : ZRequest) {
	return new Promise<UniApp.RequestSuccessCallbackResult>((resolve, reject) => {

		uni.request({
			timeout: 60000,
			method,
			url: getUrl(url),
			data,
			responseType,
			header: getRequestHeader(header),
			success(response) {
				resolve(response);
			},
			fail(err) {
				reject(err);
			},
		});
	});
};

const uniUpload = async ({ url = '', method = 'POST', responseType, header = {} } : ZRequest, path : string) => {
	return new Promise<UniApp.UploadFileSuccessCallbackResult>((resolve, reject) => {
		uni.uploadFile({
			url: getUrl(url),
			method,
			timeout: 60000,
			responseType,
			header: getRequestHeader(header),
			name: 'file',
			filePath: path,
			success: res => {
				resolve(res);
			},
			fail: err => {
				reject(err);
			},
		});
	});
};
export const upload = async function <R = any>(r : ZRequest, path : string) : Promise<[any, ZResponse<R> | null]> {
	try {
		const res = await uniUpload(r, path);
		return await handleSuccess<R>({ statusCode: res.statusCode, data: JSON.parse(res.data) });
	} catch (e) {
		return [e, null];
	}
};

export const request = async function <R = any>(r : ZRequest) : Promise<[any, ZResponse<R> | null]> {
	try {
		const res = await uniRequest(r);
		return await handleSuccess<R>(res, r);
	} catch (e) {
		return [e, null];
	}
};