import { request } from '@/utils/request';

export default {
	// 公园列表
	queryList() {
		return request({
			url: "/park/queryList",
			method: 'GET',
		});
	},
	// 获取公告分页列表
	noticePage(data : any) {
		return request({
			url: "/website-app/notice/noticePage",
			method: 'POST',
			data,
		});
	},
};