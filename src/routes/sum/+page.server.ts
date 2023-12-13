import type { Actions } from './$types';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const res = await fetch('https://api.distro.myk.digital/sum', {
      method: 'POST',
      body: data
    });
    return res.json();
  }
} satisfies Actions;