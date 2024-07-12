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
// const baseUrl = 'http://192.168.183.174:3000'; // 如果后端是本期启动，这个是本地ip地址
const baseUrl = 'http://10.2.185.55:3000'; // 如果后端是本期启动，这个是本地ip地址

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

/**
 * 处理网络请求或文件上传的成功响应
 *
 * 该函数接收一个响应对象和一个可选参数 arg，对响应进行检查，根据状态码采取不同的动作。
 * 如果状态码表示成功，直接返回响应数据; 如果状态码表示错误或失败，则根据错误类型调用 handleError 函数显示错误信息，并返回错误信息和空响应的元组; 
 * 如果状态码表示需要重新登录，则调用 relogin 函数，并返回错误信息和空响应的元组。
 *
 * @param response - 网络请求或文件上传的响应对象
 * @param arg - 一个可选的任意类型参数，可以在函数内部使用
 * @returns 一个 Promise，解析为一个元组，包含错误对象（如果有）和响应对象（如果状态码为 200 并且 code 为 0）或 null（其他状态码或有错误情况）
 */
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
/**
 * 上传文件到指定 URL
 *
 * @param {Object} param - 包含上传参数的对象
 * @param {string} param.url - 上传的目标 URL，默认为空字符串
 * @param {string} param.method - 使用的 HTTP 方法，默认为 POST
 * @param {string} param.responseType - 期望的响应类型，例如 'json' 或 'text'
 * @param {Object} param.header - 请求头
 * @param {string} path - 需要上传的文件路径
 * @return {Promise} 在上传成功或失败时解析的 Promise
 */
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
/**
 * 执行文件上传操作。
 * 该函数首先调用 uniUpload 获取响应数据，然后尝试解析响应数据为 JSON 格式，
 * 根据 statusCode 处理相应的逻辑，最终返回 [any, ZResponse<R> | null] 类型的 Promise。

 * @param r - ZRequest 请求对象，包含了上传所需的所有信息，如 url、方法、响应类型和请求头等。
 * @param path - 本地文件路径，是需要上传的文件的完整路径。
 * @returns 一个 Promise，当上传成功时该 Promise 解析为一个元组，包含错误对象（如果有）和 ZResponse<R> 类型的响应对象。
 * 如果上传失败，该 Promise 解析为一个元组，包含错误对象（即捕获的异常）和 null。
 */
export const upload = async function <R = any>(r : ZRequest, path : string) : Promise<[any, ZResponse<R> | null]> {
	try {
		const res = await uniUpload(r, path);
		return await handleSuccess<R>({ statusCode: res.statusCode, data: JSON.parse(res.data) });
	} catch (e) {
		return [e, null];
	}
};
/**
 * 请求函数，发起一个异步网络请求，请求成功时返回解析后的结果，请求失败时返回错误信息
 * @param r - 请求参数，一个 ZRequest 类型的对象，包含请求的必要信息
 * @returns 一个 Promise，在请求成功时 resolve 一个元组，包含 null（表示没有错误）和响应结果组成的 ZResponse<R> 对象；请求失败时 reject 一个元组，包含错误对象 e（例如网络错误或服务器错误）和 null（表示没有响应）
 */
export const request = async function <R = any>(r : ZRequest) : Promise<[any, ZResponse<R> | null]> {
	try {
		const res = await uniRequest(r);
		return await handleSuccess<R>(res, r);
	} catch (e) {
		return [e, null];
	}
};