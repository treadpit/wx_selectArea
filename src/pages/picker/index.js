import initAreaPicker, { getSelectedAreaData } from '../../template/index';

Page({
	onShow: () => {
		initAreaPicker();
	},
	getSelecedData() {
		console.table(getSelectedAreaData());
	}
});
