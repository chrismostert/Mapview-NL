import tippy from 'tippy.js';
import 'tippy.js/animations/scale-subtle.css';
import 'tippy.js/dist/tippy.css';

export function tooltip(node, params = {}) {
	const content = params.content;
	const tip = tippy(node, { content, animation: 'scale-subtle', ...params });
	return {
		update: (newParams) => tip.setProps({ content, animation: 'scale-subtle', ...newParams }),
		destroy: () => tip.destroy()
	};
}
