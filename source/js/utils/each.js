export const each = (array, callback)=>{
	for (var i = 0; i < array.length; i++) {
		callback.call(array[i], i, array[i])
	}
}