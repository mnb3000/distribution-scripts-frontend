import type { Actions } from './$types';
import { base64ArrayBuffer } from './base64ArrayBuffer';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const res = await fetch('https://api.distro.myk.wtf/split', {
			method: 'POST',
			body: data
		});
		const blob = await res.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const base64Data = base64ArrayBuffer(arrayBuffer);
		return {
			base64Data,
			filetype: res.headers.get('content-type'),
			filename: res.headers.get('content-disposition')?.split('filename=')[1]
		};
	}
} satisfies Actions;
