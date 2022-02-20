export default {
	// 时间转换
	dateTime(time) {
		let h = time.getHours() 
		let m = time.getMinutes()
		
		h = h < 10 ? '0' + h : h
		m = m < 10 ? '0' + m : m
	
		return h + ':' + m
	}
}